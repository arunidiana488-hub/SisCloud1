// ---------------------------------------------------------------------
// IDENTIFICACIÓN TEMPORAL (solo desarrollo).
// El sistema base aún no tiene login. Mientras tanto el módulo lee el
// usuario desde las cabeceras x-usuario-id y x-rol. NO es seguro:
// cuando exista el módulo de autenticación (JWT), reemplazar SOLO este
// archivo para que llene req.usuario = { id, rol } desde el token.
// ---------------------------------------------------------------------
export const ROLES = ['estudiante', 'docente', 'administrador'];

export function identificar(req, res, next) {
  const id = Number(req.header('x-usuario-id'));
  const rol = req.header('x-rol');
  if (!Number.isInteger(id) || id <= 0 || !ROLES.includes(rol)) {
    return res.status(401).json({ error: 'Falta identificación (x-usuario-id y x-rol válidos).' });
  }
  req.usuario = { id, rol };
  next();
}

export const permitir = (...roles) => (req, res, next) =>
  roles.includes(req.usuario.rol)
    ? next()
    : res.status(403).json({ error: 'Tu rol no puede realizar esta acción.' });
