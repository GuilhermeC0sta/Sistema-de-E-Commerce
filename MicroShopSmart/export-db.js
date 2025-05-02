import { Client } from 'pg';
import fs from 'fs';

const client = new Client({
  user: 'neondb_owner',
  password: 'npg_iJN81fOCMgeK',
  host: 'ep-floral-hall-a45f20jx.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  ssl: { rejectUnauthorized: false }
});

await client.connect();

const tabelas = [
  'carts',
  'orders',
  'order_items',
  'payment_methods',
  'shipping_options',
  'cart_items',
  'products',
  'users',
  'session'
];

for (const tabela of tabelas) {
  const res = await client.query(`SELECT * FROM ${tabela}`);
  fs.writeFileSync(`${tabela}.json`, JSON.stringify(res.rows, null, 2));
  console.log(`✔ Exportado: ${tabela}.json`);
}

await client.end();
