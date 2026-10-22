import express, { Router } from 'express';
import { identificar } from './auth.js';
import proyectosRoutes from './proyectos.routes.js';

// Módulo: Seguimiento - Gestión de Proyectos Académicos.
// Se monta en el servidor con: app.use('/api/seguimiento', seguimiento);
const router = Router();

router.use(express.json());
router.use(identificar);
router.use(proyectosRoutes);

router.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// Manejo de errores del módulo (no afecta al resto del sistema).
router.use((err, req, res, next) => {
  // JSON mal formado en el cuerpo de la petición.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido.' });
  }
  // Otros errores del cliente detectados por Express (cuerpo muy grande, etc.).
  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  // Errores de PostgreSQL causados por datos inválidos.
  const clienteMalo = ['22P02', '23503', '23505', '23514', '22007', '22008'];
  if (clienteMalo.includes(err.code)) {
    return res.status(400).json({ error: 'Datos inválidos o inconsistentes.', detalle: err.detail ?? err.message });
  }
  console.error('[seguimiento]', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export default router;