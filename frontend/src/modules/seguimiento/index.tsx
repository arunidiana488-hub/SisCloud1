import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BarraSesion, SesionProvider } from './sesion';
import ListaProyectos from './pages/ListaProyectos';
import DetalleProyecto from './pages/DetalleProyecto';

// Módulo: Seguimiento - Gestión de Proyectos Académicos.
// Se monta en App.tsx con: <Route path='/seguimiento/*' element={<SeguimientoModule/>}/>
export default function SeguimientoModule() {
  return (
    <SesionProvider>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
        <BarraSesion />
        <Routes>
          <Route index element={<ListaProyectos />} />
          <Route path="proyectos/:id" element={<DetalleProyecto />} />
        </Routes>
      </div>
    </SesionProvider>
  );
}
