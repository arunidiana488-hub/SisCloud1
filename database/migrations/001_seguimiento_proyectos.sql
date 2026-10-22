-- =====================================================================
-- Módulo: Seguimiento - Gestión de Proyectos Académicos
-- Todas las tablas llevan el prefijo seg_ para no chocar con otros módulos.
-- Los campos *_id de usuario son INTEGER sin FOREIGN KEY porque la tabla
-- de usuarios todavía no existe (módulo Gestión de Usuarios). Cuando exista,
-- agregar: ALTER TABLE ... ADD FOREIGN KEY (...) REFERENCES usuarios(id);
-- =====================================================================

CREATE TABLE IF NOT EXISTS seg_proyectos (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(200) NOT NULL,
  descripcion    TEXT,
  materia_id     INTEGER REFERENCES materias(id) ON DELETE SET NULL,
  docente_id     INTEGER NOT NULL,
  estado         VARCHAR(20) NOT NULL DEFAULT 'planificado'
                 CHECK (estado IN ('planificado','en_progreso','en_revision','completado','cancelado')),
  fecha_inicio   DATE,
  fecha_fin      DATE,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (fecha_inicio IS NULL OR fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS seg_miembros (
  proyecto_id INTEGER NOT NULL REFERENCES seg_proyectos(id) ON DELETE CASCADE,
  usuario_id  INTEGER NOT NULL,
  rol_equipo  VARCHAR(50) NOT NULL DEFAULT 'integrante',
  PRIMARY KEY (proyecto_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS seg_hitos (
  id           SERIAL PRIMARY KEY,
  proyecto_id  INTEGER NOT NULL REFERENCES seg_proyectos(id) ON DELETE CASCADE,
  titulo       VARCHAR(200) NOT NULL,
  descripcion  TEXT,
  fecha_limite DATE,
  estado       VARCHAR(20) NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente','en_progreso','completado')),
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seg_avances (
  id                SERIAL PRIMARY KEY,
  proyecto_id       INTEGER NOT NULL REFERENCES seg_proyectos(id) ON DELETE CASCADE,
  hito_id           INTEGER REFERENCES seg_hitos(id) ON DELETE SET NULL,
  autor_id          INTEGER NOT NULL,
  titulo            VARCHAR(200) NOT NULL,
  descripcion       TEXT,
  enlace            VARCHAR(500),  -- futuro: reemplazar por archivo del módulo "Espacio en la nube"
  revision_estado   VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (revision_estado IN ('pendiente','aprobado','observado')),
  retroalimentacion TEXT,
  calificacion      NUMERIC(5,2) CHECK (calificacion IS NULL OR calificacion BETWEEN 0 AND 100),
  revisado_por      INTEGER,
  revisado_en       TIMESTAMPTZ,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Historial de cambios de estado: alimenta Auditoría e Informes.
CREATE TABLE IF NOT EXISTS seg_historial_estados (
  id              SERIAL PRIMARY KEY,
  proyecto_id     INTEGER NOT NULL REFERENCES seg_proyectos(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(20),
  estado_nuevo    VARCHAR(20) NOT NULL,
  usuario_id      INTEGER NOT NULL,
  comentario      TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seg_proyectos_docente ON seg_proyectos(docente_id);
CREATE INDEX IF NOT EXISTS idx_seg_miembros_usuario  ON seg_miembros(usuario_id);
CREATE INDEX IF NOT EXISTS idx_seg_hitos_proyecto    ON seg_hitos(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_seg_avances_proyecto  ON seg_avances(proyecto_id);
