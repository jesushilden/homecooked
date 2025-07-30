import pg from 'pg';

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://homecooked_user:homecooked_password@localhost:5432/homecooked',
});

export default pool;
