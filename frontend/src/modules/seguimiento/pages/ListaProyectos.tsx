import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, enviar } from '../api';
import { useSesion } from '../sesion';
import { boton, campo, error as estiloError, etiqueta, insignia, tarjeta } from '../estilos';
import type { ProyectoResumen } from '../types';

export default function ListaProyectos() {
  const { sesion } = useSesion();
  const [proyectos, setProyectos] = useState<ProyectoResumen[]>([]);
  const [resumen, setResumen] = useState<any>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState({ titulo: '', descripcion: '' });

  const cargar = async () => {
    setCargando(true); setError('');
    try {
      setProyectos(await api<ProyectoResumen[]>('/proyectos', sesion));
      setResumen(sesion.rol === 'estudiante' ? null : await api('/resumen', sesion));
    } catch (e: any) { setError(e.message); } finally { setCargando(false); }
  };
  useEffect(() => { cargar(); }, [sesion.usuarioId, sesion.rol]);

  const crear = async () => {
    try {
      await api('/proyectos', sesion, enviar('POST', form));
      setForm({ titulo: '', descripcion: '' });
      cargar();
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div>
      <h2>Seguimiento de proyectos académicos</h2>
      {error && <p style={estiloError}>{error}</p>}

      {resumen && (
        <div style={{ ...tarjeta, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {resumen.proyectos_por_estado.map((r: any) => (
            <span key={r.estado} style={insignia(r.estado)}>{etiqueta(r.estado)}: {r.total}</span>
          ))}
          <span style={insignia('pendiente')}>Avances por revisar: {resumen.avances_pendientes_de_revision}</span>
        </div>
      )}

      {sesion.rol === 'docente' && (
        <div style={tarjeta}>
          <strong>Nuevo proyecto</strong>
          <input style={campo} placeholder="Título" value={form.titulo}
                 onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <textarea style={campo} placeholder="Descripción" value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <button style={boton} disabled={!form.titulo.trim()} onClick={crear}>Crear proyecto</button>
        </div>
      )}

      {cargando && <p>Cargando…</p>}
      {!cargando && !error && proyectos.length === 0 && <p>No hay proyectos para mostrar.</p>}

      {proyectos.map((p) => {
        const avance = p.hitos_total ? Math.round((p.hitos_completados / p.hitos_total) * 100) : 0;
        return (
          <Link key={p.id} to={`/seguimiento/proyectos/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={tarjeta}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong>{p.titulo}</strong>
                <span style={insignia(p.estado)}>{etiqueta(p.estado)}</span>
              </div>
              <small>{p.materia ?? 'Sin materia'} · Hitos {p.hitos_completados}/{p.hitos_total} ({avance}%)</small>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
