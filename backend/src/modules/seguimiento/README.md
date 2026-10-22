# Módulo: Seguimiento – Gestión de Proyectos Académicos

Rama: `feature/seguimiento-proyectos-academicos`

## Actores
| Actor | Qué puede hacer |
|---|---|
| Docente | Crear proyectos, asignar estudiantes, definir hitos, cambiar el estado, revisar avances (aprobar/observar, nota y retroalimentación), ver resumen |
| Estudiante | Ver sus proyectos, ver hitos, enviar avances y leer la retroalimentación |
| Administrador | Solo lectura de todos los proyectos y resumen global (insumo para Informes y Auditoría) |

## Endpoints (`/api/seguimiento`)
| Método | Ruta | Roles |
|---|---|---|
| GET | `/proyectos?estado=` | todos (cada uno ve lo suyo; admin ve todo) |
| POST | `/proyectos` | docente |
| GET | `/proyectos/:id` | todos con acceso |
| PATCH | `/proyectos/:id/estado` | docente dueño |
| POST / DELETE | `/proyectos/:id/miembros[/:usuarioId]` | docente dueño |
| POST | `/proyectos/:id/hitos` | docente dueño |
| PATCH | `/hitos/:hitoId` | docente dueño |
| POST | `/proyectos/:id/avances` | estudiante miembro |
| PATCH | `/avances/:avanceId/revision` | docente dueño |
| GET | `/resumen` | docente, administrador |

## Pendientes de integración con otros módulos
- **Gestión de usuarios / login**: reemplazar `auth.js` (hoy usa cabeceras `x-usuario-id` y `x-rol`) por JWT y agregar las FOREIGN KEY a `usuarios`.
- **Espacio en la nube**: reemplazar `seg_avances.enlace` por archivos subidos.
- **Auditoría**: leer `seg_historial_estados`.
- **Informes y reportes**: consumir `GET /resumen`.
