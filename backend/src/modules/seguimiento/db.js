import pg from 'pg';

// Pool propio del módulo. Los valores por defecto coinciden con docker-compose.yml (solo desarrollo).
export const pool = new pg.Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'siscloud',
  user: process.env.DB_USER ?? 'siscloud_user',
  password: process.env.DB_PASSWORD ?? 'siscloud_pass',
});
