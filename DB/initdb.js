import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user:'postgres',
  host: 'db',
  database: 'productsdb',
  password: 'postgrespw',
  port: 5432,
});


export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      sku VARCHAR(50)  NOT NULL,
      name VARCHAR(100) NOT NULL,
      brand VARCHAR(50) NOT NULL,
      color VARCHAR(50) NOT NULL,
      size VARCHAR(15) NOT NULL,
      mrp NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      quantity INTEGER DEFAULT 0
    );
  `);
  console.log('Table ready');
}