import { pool } from './initdb.js';

export async function insertProduct(row) {
  
  const { sku, name, brand, color, size, mrp, price, quantity } = row;

  if (!sku || !name || !brand || !color || !size || !mrp || !price)
    throw new Error('Missing required fields');

  if (Number(price) > Number(mrp))
    throw new Error(`Price (${price}) cannot exceed MRP (${mrp})`);

  if (Number(quantity) < 0)
    throw new Error('Quantity cannot be negative');

  await pool.query(
    `INSERT INTO products (sku, name, brand, color, size, mrp, price, quantity)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [sku, name, brand, color, size, mrp, price, quantity || 0]
  );
}
