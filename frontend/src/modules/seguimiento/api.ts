import type { Sesion } from './types';

const BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000';

// Cliente HTTP del módulo. Envía la identificación temporal (ver backend/auth.js).
export async function api<T>(ruta: string, sesion: Sesion, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/api/seguimiento${ruta}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-usuario-id': String(sesion.usuarioId),
      'x-rol': sesion.rol,
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
  return data as T;
}

export const enviar = (metodo: string, cuerpo: unknown): RequestInit => ({
  method: metodo,
  body: JSON.stringify(cuerpo),
});
