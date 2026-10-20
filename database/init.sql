CREATE TABLE roles(id SERIAL PRIMARY KEY,nombre VARCHAR(50));
CREATE TABLE materias(id SERIAL PRIMARY KEY,nombre VARCHAR(120));
INSERT INTO materias(nombre) VALUES('Sistemas de Información II'),('Redes Avanzadas'),('Ingeniería de Sistemas II'),('Big Data'),('Desarrollo de Aplicaciones Móviles');