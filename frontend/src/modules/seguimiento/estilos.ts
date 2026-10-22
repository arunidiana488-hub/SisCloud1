import type { CSSProperties } from 'react';

export const tarjeta: CSSProperties = { border: '1px solid #e5e7f0', borderRadius: 12, padding: 16, marginBottom: 12, background: '#fff' };
export const boton: CSSProperties = { background: '#3b5bff', color: '#fff', border: 0, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' };
export const campo: CSSProperties = { display: 'block', width: '100%', boxSizing: 'border-box', margin: '6px 0 10px', padding: 8 };
export const error: CSSProperties = { color: '#b42318', background: '#fef3f2', padding: 8, borderRadius: 8 };

const COLORES: Record<string, string> = {
  planificado: '#6b7280', en_progreso: '#2563eb', en_revision: '#a16207', completado: '#0f8a5f', cancelado: '#b42318',
  pendiente: '#6b7280', aprobado: '#0f8a5f', observado: '#a16207',
};
export const insignia = (valor: string): CSSProperties => ({
  background: `${COLORES[valor] ?? '#6b7280'}22`, color: COLORES[valor] ?? '#6b7280',
  borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
});
export const etiqueta = (v: string) => v.replace('_', ' ');
