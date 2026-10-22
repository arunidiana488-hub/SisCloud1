import React, { createContext, useContext, useState } from 'react';
import type { Rol, Sesion } from './types';

// SESIÓN TEMPORAL (solo desarrollo): se guarda en localStorage.
// Cuando exista el módulo de login, reemplazar este archivo por la sesión real.
const CLAVE = 'seguimiento.sesion';
const POR_DEFECTO: Sesion = { usuarioId: 2, rol: 'estudiante' };

function leer(): Sesion {
  try { return JSON.parse(localStorage.getItem(CLAVE) ?? '') as Sesion; } catch { return POR_DEFECTO; }
}

const Contexto = createContext<{ sesion: Sesion; cambiar: (s: Sesion) => void }>({
  sesion: POR_DEFECTO, cambiar: () => {},
});

export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<Sesion>(leer);
  const cambiar = (s: Sesion) => {
    setSesion(s);
    try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch { /* sin almacenamiento */ }
  };
  return <Contexto.Provider value={{ sesion, cambiar }}>{children}</Contexto.Provider>;
}

export const useSesion = () => useContext(Contexto);

export function BarraSesion() {
  const { sesion, cambiar } = useSesion();
  return (
    <div style={{ background: '#fff8e1', padding: 8, marginBottom: 16, fontSize: 13 }}>
      <strong>Modo prueba</strong> — actuar como:{' '}
      <select value={sesion.rol} onChange={(e) => cambiar({ ...sesion, rol: e.target.value as Rol })}>
        <option value="estudiante">Estudiante</option>
        <option value="docente">Docente</option>
        <option value="administrador">Administrador</option>
      </select>{' '}
      usuario #
      <input
        type="number" min={1} style={{ width: 60 }} value={sesion.usuarioId}
        onChange={(e) => cambiar({ ...sesion, usuarioId: Number(e.target.value) || 1 })}
      />
    </div>
  );
}
