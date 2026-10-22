export type Rol = 'estudiante' | 'docente' | 'administrador';
export type EstadoProyecto = 'planificado' | 'en_progreso' | 'en_revision' | 'completado' | 'cancelado';
export type EstadoHito = 'pendiente' | 'en_progreso' | 'completado';
export type EstadoRevision = 'pendiente' | 'aprobado' | 'observado';

export interface Sesion { usuarioId: number; rol: Rol }

export interface ProyectoResumen {
  id: number; titulo: string; descripcion: string | null; materia: string | null;
  docente_id: number; estado: EstadoProyecto;
  fecha_inicio: string | null; fecha_fin: string | null;
  hitos_total: number; hitos_completados: number;
}
export interface Miembro { usuario_id: number; rol_equipo: string }
export interface Hito { id: number; titulo: string; descripcion: string | null; fecha_limite: string | null; estado: EstadoHito }
export interface Avance {
  id: number; hito_id: number | null; autor_id: number; titulo: string; descripcion: string | null;
  enlace: string | null; revision_estado: EstadoRevision; retroalimentacion: string | null;
  calificacion: string | null; creado_en: string;
}
export interface Historial { id: number; estado_anterior: string | null; estado_nuevo: string; usuario_id: number; comentario: string | null; creado_en: string }
export interface ProyectoDetalle extends Omit<ProyectoResumen, 'hitos_total' | 'hitos_completados' | 'materia'> {
  miembros: Miembro[]; hitos: Hito[]; avances: Avance[]; historial: Historial[];
}
