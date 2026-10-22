-- Datos de prueba (solo desarrollo). Docente = usuario 1, estudiantes = 2 y 3.
INSERT INTO seg_proyectos (titulo, descripcion, materia_id, docente_id, estado, fecha_inicio, fecha_fin)
VALUES ('Plataforma de gestión académica en la nube',
        'Proyecto final de Sistemas de Información II.',
        1, 1, 'en_progreso', CURRENT_DATE, CURRENT_DATE + 90);

INSERT INTO seg_miembros (proyecto_id, usuario_id, rol_equipo) VALUES (1, 2, 'líder'), (1, 3, 'integrante');

INSERT INTO seg_hitos (proyecto_id, titulo, descripcion, fecha_limite, estado) VALUES
 (1, 'Levantamiento de requisitos', 'Documento de requisitos y casos de uso.', CURRENT_DATE + 14, 'completado'),
 (1, 'Diseño de base de datos',     'Modelo entidad-relación y script SQL.',   CURRENT_DATE + 30, 'en_progreso'),
 (1, 'Prototipo funcional',         'Primera versión navegable.',              CURRENT_DATE + 60, 'pendiente');

INSERT INTO seg_avances (proyecto_id, hito_id, autor_id, titulo, descripcion, enlace)
VALUES (1, 2, 2, 'Primer borrador del modelo ER', 'Incluye tablas principales.', 'https://example.com/modelo-er');

INSERT INTO seg_historial_estados (proyecto_id, estado_anterior, estado_nuevo, usuario_id, comentario)
VALUES (1, NULL, 'planificado', 1, 'Proyecto creado'), (1, 'planificado', 'en_progreso', 1, 'Inicio del proyecto');
