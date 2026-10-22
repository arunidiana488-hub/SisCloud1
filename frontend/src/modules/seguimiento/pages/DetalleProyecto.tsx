import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, enviar } from '../api';
import { useSesion } from '../sesion';
import { boton, campo, error as estiloError, etiqueta, insignia, tarjeta } from '../estilos';
import type { Avance, EstadoHito, EstadoProyecto, ProyectoDetalle } from '../types';

const ESTADOS: EstadoProyecto[] = ['planificado', 'en_progreso', 'en_revision', 'completado', 'cancelado'];
const ESTADOS_HITO: EstadoHito[] = ['pendiente', 'en_progreso', 'completado'];

export default function DetalleProyecto() {
  const { id } = useParams();
  const { sesion } = useSesion();
  const [p, setP] = useState<ProyectoDetalle | null>(null);
  const [error, setError] = useState('');
  const [hito, setHito] = useState({ titulo: '', fecha_limite: '' });
  const [avance, setAvance] = useState({ titulo: '', descripcion: '', enlace: '', hito_id: '' });
  const [miembro, setMiembro] = useState('');

  const esDocente = sesion.rol === 'docente';
  const esEstudiante = sesion.rol === 'estudiante';

  const cargar = useCallback(async () => {
    try { setP(await api<ProyectoDetalle>(`/proyectos/${id}`, sesion)); setError(''); }
    catch (e: any) { setP(null); setError(e.message); }
  }, [id, sesion.usuarioId, sesion.rol]);
  useEffect(() => { cargar(); }, [cargar]);

  // Ejecuta una acción, muestra el error si falla y recarga el proyecto.
  const accion = async (fn: () => Promise<unknown>) => {
    try { await fn(); await cargar(); } catch (e: any) { setError(e.message); }
  };

  if (!p) return <div><Link to="/seguimiento">← Volver</Link>{error && <p style={estiloError}>{error}</p>}</div>;

  const revisar = (a: Avance, estado: 'aprobado' | 'observado') => {
    const retroalimentacion = window.prompt('Retroalimentación para el estudiante:') ?? '';
    const nota = window.prompt('Calificación (0-100, opcional):') ?? '';
    accion(() => api(`/avances/${a.id}/revision`, sesion,
      enviar('PATCH', { estado, retroalimentacion, calificacion: nota === '' ? null : Number(nota) })));
  };

  return (
    <div>
      <Link to="/seguimiento">← Volver</Link>
      {error && <p style={estiloError}>{error}</p>}

      <div style={tarjeta}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <h2 style={{ margin: 0 }}>{p.titulo}</h2>
          {esDocente ? (
            <select value={p.estado}
                    onChange={(e) => accion(() => api(`/proyectos/${p.id}/estado`, sesion, enviar('PATCH', { estado: e.target.value })))}>
              {ESTADOS.map((s) => <option key={s} value={s}>{etiqueta(s)}</option>)}
            </select>
          ) : <span style={insignia(p.estado)}>{etiqueta(p.estado)}</span>}
        </div>
        <p>{p.descripcion}</p>
        <small>Docente #{p.docente_id} · {p.fecha_inicio?.slice(0, 10) ?? '—'} a {p.fecha_fin?.slice(0, 10) ?? '—'}</small>
      </div>

      <h3>Equipo</h3>
      <div style={tarjeta}>
        {p.miembros.length === 0 && <small>Sin integrantes todavía.</small>}
        {p.miembros.map((m) => (
          <div key={m.usuario_id}>
            Estudiante #{m.usuario_id} — {m.rol_equipo}{' '}
            {esDocente && <button onClick={() => accion(() => api(`/proyectos/${p.id}/miembros/${m.usuario_id}`, sesion, { method: 'DELETE' }))}>Quitar</button>}
          </div>
        ))}
        {esDocente && (
          <div style={{ marginTop: 8 }}>
            <input type="number" min={1} placeholder="ID de estudiante" value={miembro} onChange={(e) => setMiembro(e.target.value)} />{' '}
            <button style={boton} disabled={!miembro}
                    onClick={() => accion(async () => { await api(`/proyectos/${p.id}/miembros`, sesion, enviar('POST', { usuario_id: Number(miembro) })); setMiembro(''); })}>
              Agregar
            </button>
          </div>
        )}
      </div>

      <h3>Hitos</h3>
      {p.hitos.map((h) => (
        <div key={h.id} style={{ ...tarjeta, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span><strong>{h.titulo}</strong>{h.fecha_limite && <small> · vence {h.fecha_limite.slice(0, 10)}</small>}</span>
          {esDocente ? (
            <select value={h.estado}
                    onChange={(e) => accion(() => api(`/hitos/${h.id}`, sesion, enviar('PATCH', { estado: e.target.value })))}>
              {ESTADOS_HITO.map((s) => <option key={s} value={s}>{etiqueta(s)}</option>)}
            </select>
          ) : <span style={insignia(h.estado)}>{etiqueta(h.estado)}</span>}
        </div>
      ))}
      {esDocente && (
        <div style={tarjeta}>
          <input style={campo} placeholder="Nuevo hito" value={hito.titulo} onChange={(e) => setHito({ ...hito, titulo: e.target.value })} />
          <input style={campo} type="date" value={hito.fecha_limite} onChange={(e) => setHito({ ...hito, fecha_limite: e.target.value })} />
          <button style={boton} disabled={!hito.titulo.trim()}
                  onClick={() => accion(async () => {
                    await api(`/proyectos/${p.id}/hitos`, sesion, enviar('POST', { titulo: hito.titulo, fecha_limite: hito.fecha_limite || null }));
                    setHito({ titulo: '', fecha_limite: '' });
                  })}>Agregar hito</button>
        </div>
      )}

      <h3>Avances y retroalimentación</h3>
      {p.avances.length === 0 && <small>Aún no hay avances.</small>}
      {p.avances.map((a) => (
        <div key={a.id} style={tarjeta}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>{a.titulo}</strong><span style={insignia(a.revision_estado)}>{a.revision_estado}</span>
          </div>
          <small>Estudiante #{a.autor_id} · {a.creado_en.slice(0, 10)}</small>
          {a.descripcion && <p>{a.descripcion}</p>}
          {a.enlace && <p><a href={a.enlace} target="_blank" rel="noreferrer">Ver entregable</a></p>}
          {a.retroalimentacion && <p><em>Docente: {a.retroalimentacion}{a.calificacion && ` (nota ${a.calificacion})`}</em></p>}
          {esDocente && (
            <>
              <button style={boton} onClick={() => revisar(a, 'aprobado')}>Aprobar</button>{' '}
              <button onClick={() => revisar(a, 'observado')}>Observar</button>
            </>
          )}
        </div>
      ))}
      {esEstudiante && (
        <div style={tarjeta}>
          <strong>Enviar avance</strong>
          <input style={campo} placeholder="Título" value={avance.titulo} onChange={(e) => setAvance({ ...avance, titulo: e.target.value })} />
          <textarea style={campo} placeholder="Descripción" value={avance.descripcion} onChange={(e) => setAvance({ ...avance, descripcion: e.target.value })} />
          <input style={campo} placeholder="Enlace al entregable (https://…)" value={avance.enlace} onChange={(e) => setAvance({ ...avance, enlace: e.target.value })} />
          <select style={campo} value={avance.hito_id} onChange={(e) => setAvance({ ...avance, hito_id: e.target.value })}>
            <option value="">Sin hito asociado</option>
            {p.hitos.map((h) => <option key={h.id} value={h.id}>{h.titulo}</option>)}
          </select>
          <button style={boton} disabled={!avance.titulo.trim()}
                  onClick={() => accion(async () => {
                    await api(`/proyectos/${p.id}/avances`, sesion, enviar('POST', {
                      titulo: avance.titulo, descripcion: avance.descripcion || null,
                      enlace: avance.enlace || null, hito_id: avance.hito_id ? Number(avance.hito_id) : null,
                    }));
                    setAvance({ titulo: '', descripcion: '', enlace: '', hito_id: '' });
                  })}>Enviar avance</button>
        </div>
      )}

      <h3>Historial de estados</h3>
      <div style={tarjeta}>
        {p.historial.map((x) => (
          <div key={x.id}><small>{x.creado_en.slice(0, 10)} — {x.estado_anterior ?? 'nuevo'} → {x.estado_nuevo} (usuario #{x.usuario_id}){x.comentario && `: ${x.comentario}`}</small></div>
        ))}
      </div>
    </div>
  );
}
