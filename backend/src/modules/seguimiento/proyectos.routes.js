import { Router } from 'express';
import { pool } from './db.js';
import { permitir } from './auth.js';

const router = Router();

const ESTADOS_PROYECTO = ['planificado', 'en_progreso', 'en_revision', 'completado', 'cancelado'];
const ESTADOS_HITO = ['pendiente', 'en_progreso', 'completado'];
const ESTADOS_REVISION = ['aprobado', 'observado'];

// Envuelve handlers async (compatible con Express 4 y 5).
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Valida que los parámetros de ruta sean enteros positivos.
for (const nombre of ['id', 'hitoId', 'avanceId']) {
  router.param(nombre, (req, res, next, valor) => {
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) return res.status(400).json({ error: `Parámetro ${nombre} inválido.` });
    req.params[nombre] = n;
    next();
  });
}

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

/** Devuelve el proyecto solo si el usuario tiene permiso de verlo. */
async function proyectoAccesible(id, u) {
  const { rows } = await pool.query('SELECT * FROM seg_proyectos WHERE id = $1', [id]);
  const p = rows[0];
  if (!p) return null;
  if (u.rol === 'administrador') return p;
  if (u.rol === 'docente') return p.docente_id === u.id ? p : null;
  const m = await pool.query('SELECT 1 FROM seg_miembros WHERE proyecto_id = $1 AND usuario_id = $2', [id, u.id]);
  return m.rowCount ? p : null;
}

// Sale con 404 si no existe o no tiene acceso (no revela existencia).
async function exigirProyecto(req, res, id) {
  const p = await proyectoAccesible(id, req.usuario);
  if (!p) res.status(404).json({ error: 'Proyecto no encontrado.' });
  return p;
}

// Solo el docente dueño puede modificar (el administrador es de solo lectura).
const esDocenteDuenio = (p, u) => u.rol === 'docente' && p.docente_id === u.id;

// ---------------------------------------------------------------------
// PROYECTOS
// ---------------------------------------------------------------------
const SELECT_LISTA = `
  SELECT p.*, m.nombre AS materia,
    (SELECT COUNT(*)::int FROM seg_hitos x WHERE x.proyecto_id = p.id) AS hitos_total,
    (SELECT COUNT(*)::int FROM seg_hitos x WHERE x.proyecto_id = p.id AND x.estado = 'completado') AS hitos_completados
  FROM seg_proyectos p
  LEFT JOIN materias m ON m.id = p.materia_id`;

router.get('/proyectos', h(async (req, res) => {
  const { rol, id } = req.usuario;
  const filtroEstado = ESTADOS_PROYECTO.includes(req.query.estado) ? req.query.estado : null;
  const cond = [];
  const params = [];

  if (rol === 'docente') { params.push(id); cond.push(`p.docente_id = $${params.length}`); }
  if (rol === 'estudiante') {
    params.push(id);
    cond.push(`EXISTS (SELECT 1 FROM seg_miembros sm WHERE sm.proyecto_id = p.id AND sm.usuario_id = $${params.length})`);
  }
  if (filtroEstado) { params.push(filtroEstado); cond.push(`p.estado = $${params.length}`); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const { rows } = await pool.query(`${SELECT_LISTA} ${where} ORDER BY p.creado_en DESC`, params);
  res.json(rows);
}));

router.post('/proyectos', permitir('docente'), h(async (req, res) => {
  const titulo = texto(req.body.titulo);
  if (!titulo) return res.status(400).json({ error: 'El título es obligatorio.' });
  const { descripcion = null, materia_id = null, fecha_inicio = null, fecha_fin = null } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO seg_proyectos (titulo, descripcion, materia_id, docente_id, fecha_inicio, fecha_fin)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [titulo, descripcion, materia_id, req.usuario.id, fecha_inicio, fecha_fin],
  );
  await pool.query(
    `INSERT INTO seg_historial_estados (proyecto_id, estado_anterior, estado_nuevo, usuario_id, comentario)
     VALUES ($1, NULL, 'planificado', $2, 'Proyecto creado')`,
    [rows[0].id, req.usuario.id],
  );
  res.status(201).json(rows[0]);
}));

router.get('/proyectos/:id', h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  const [miembros, hitos, avances, historial] = await Promise.all([
    pool.query('SELECT usuario_id, rol_equipo FROM seg_miembros WHERE proyecto_id = $1 ORDER BY usuario_id', [p.id]),
    pool.query('SELECT * FROM seg_hitos WHERE proyecto_id = $1 ORDER BY fecha_limite NULLS LAST, id', [p.id]),
    pool.query('SELECT * FROM seg_avances WHERE proyecto_id = $1 ORDER BY creado_en DESC', [p.id]),
    pool.query('SELECT * FROM seg_historial_estados WHERE proyecto_id = $1 ORDER BY creado_en DESC', [p.id]),
  ]);
  res.json({ ...p, miembros: miembros.rows, hitos: hitos.rows, avances: avances.rows, historial: historial.rows });
}));

router.patch('/proyectos/:id/estado', permitir('docente'), h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  const { estado, comentario = null } = req.body;
  if (!ESTADOS_PROYECTO.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS_PROYECTO.join(', ')}.` });
  }
  if (estado === p.estado) return res.json(p);

  const { rows } = await pool.query(
    'UPDATE seg_proyectos SET estado = $1, actualizado_en = now() WHERE id = $2 RETURNING *',
    [estado, p.id],
  );
  await pool.query(
    `INSERT INTO seg_historial_estados (proyecto_id, estado_anterior, estado_nuevo, usuario_id, comentario)
     VALUES ($1,$2,$3,$4,$5)`,
    [p.id, p.estado, estado, req.usuario.id, comentario],
  );
  res.json(rows[0]);
}));

// ---------------------------------------------------------------------
// MIEMBROS DEL EQUIPO
// ---------------------------------------------------------------------
router.post('/proyectos/:id/miembros', permitir('docente'), h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  const usuarioId = Number(req.body.usuario_id);
  if (!Number.isInteger(usuarioId) || usuarioId <= 0) return res.status(400).json({ error: 'usuario_id inválido.' });

  await pool.query(
    `INSERT INTO seg_miembros (proyecto_id, usuario_id, rol_equipo) VALUES ($1,$2,$3)
     ON CONFLICT (proyecto_id, usuario_id) DO UPDATE SET rol_equipo = EXCLUDED.rol_equipo`,
    [p.id, usuarioId, texto(req.body.rol_equipo) || 'integrante'],
  );
  res.status(201).json({ ok: true });
}));

router.delete('/proyectos/:id/miembros/:usuarioId', permitir('docente'), h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  await pool.query('DELETE FROM seg_miembros WHERE proyecto_id = $1 AND usuario_id = $2', [p.id, Number(req.params.usuarioId)]);
  res.status(204).end();
}));

// ---------------------------------------------------------------------
// HITOS (los define el docente)
// ---------------------------------------------------------------------
router.post('/proyectos/:id/hitos', permitir('docente'), h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  const titulo = texto(req.body.titulo);
  if (!titulo) return res.status(400).json({ error: 'El título del hito es obligatorio.' });

  const { rows } = await pool.query(
    'INSERT INTO seg_hitos (proyecto_id, titulo, descripcion, fecha_limite) VALUES ($1,$2,$3,$4) RETURNING *',
    [p.id, titulo, req.body.descripcion ?? null, req.body.fecha_limite ?? null],
  );
  res.status(201).json(rows[0]);
}));

router.patch('/hitos/:hitoId', permitir('docente'), h(async (req, res) => {
  const { rows: [hito] } = await pool.query('SELECT * FROM seg_hitos WHERE id = $1', [req.params.hitoId]);
  const p = hito && await proyectoAccesible(hito.proyecto_id, req.usuario);
  if (!p) return res.status(404).json({ error: 'Hito no encontrado.' });
  if (!ESTADOS_HITO.includes(req.body.estado)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS_HITO.join(', ')}.` });
  }
  const { rows } = await pool.query('UPDATE seg_hitos SET estado = $1 WHERE id = $2 RETURNING *', [req.body.estado, hito.id]);
  res.json(rows[0]);
}));

// ---------------------------------------------------------------------
// AVANCES (los envía el estudiante, los revisa el docente)
// ---------------------------------------------------------------------
router.post('/proyectos/:id/avances', permitir('estudiante'), h(async (req, res) => {
  const p = await exigirProyecto(req, res, req.params.id);
  if (!p) return;
  const titulo = texto(req.body.titulo);
  if (!titulo) return res.status(400).json({ error: 'El título del avance es obligatorio.' });

  if (req.body.hito_id != null) {
    const ok = await pool.query('SELECT 1 FROM seg_hitos WHERE id = $1 AND proyecto_id = $2', [req.body.hito_id, p.id]);
    if (!ok.rowCount) return res.status(400).json({ error: 'El hito no pertenece a este proyecto.' });
  }
  const { rows } = await pool.query(
    `INSERT INTO seg_avances (proyecto_id, hito_id, autor_id, titulo, descripcion, enlace)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [p.id, req.body.hito_id ?? null, req.usuario.id, titulo, req.body.descripcion ?? null, req.body.enlace ?? null],
  );
  res.status(201).json(rows[0]);
}));

router.patch('/avances/:avanceId/revision', permitir('docente'), h(async (req, res) => {
  const { rows: [avance] } = await pool.query('SELECT * FROM seg_avances WHERE id = $1', [req.params.avanceId]);
  const p = avance && await proyectoAccesible(avance.proyecto_id, req.usuario);
  if (!p || !esDocenteDuenio(p, req.usuario)) return res.status(404).json({ error: 'Avance no encontrado.' });

  const { estado, retroalimentacion = null, calificacion = null } = req.body;
  if (!ESTADOS_REVISION.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS_REVISION.join(', ')}.` });
  }
  const { rows } = await pool.query(
    `UPDATE seg_avances
        SET revision_estado = $1, retroalimentacion = $2, calificacion = $3,
            revisado_por = $4, revisado_en = now()
      WHERE id = $5 RETURNING *`,
    [estado, retroalimentacion, calificacion, req.usuario.id, avance.id],
  );
  res.json(rows[0]);
}));

// ---------------------------------------------------------------------
// RESUMEN (insumo para el módulo Informes y Reportes)
// ---------------------------------------------------------------------
router.get('/resumen', permitir('docente', 'administrador'), h(async (req, res) => {
  const esDocente = req.usuario.rol === 'docente';
  const params = esDocente ? [req.usuario.id] : [];
  const filtroProyecto = esDocente ? 'WHERE docente_id = $1' : '';
  const filtroAvance = esDocente
    ? 'AND proyecto_id IN (SELECT id FROM seg_proyectos WHERE docente_id = $1)' : '';

  const [porEstado, pendientes] = await Promise.all([
    pool.query(`SELECT estado, COUNT(*)::int AS total FROM seg_proyectos ${filtroProyecto} GROUP BY estado`, params),
    pool.query(`SELECT COUNT(*)::int AS total FROM seg_avances WHERE revision_estado = 'pendiente' ${filtroAvance}`, params),
  ]);
  res.json({ proyectos_por_estado: porEstado.rows, avances_pendientes_de_revision: pendientes.rows[0].total });
}));

export default router;
