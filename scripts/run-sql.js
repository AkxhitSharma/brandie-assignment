#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/run-sql.js <path-to-sql>');
  process.exit(1);
}

const sqlPath = path.resolve(process.cwd(), file);
const sql = fs.readFileSync(sqlPath, 'utf8');

const { Pool } = pg;
const nodeEnv = process.env.NODE_ENV || 'development';
const connectionString =
  process.env.DATABASE_URL ||
  (nodeEnv === 'development' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD);

if (!connectionString) {
  console.error('Missing connection string. Set DATABASE_URL or DATABASE_URL_DEV/DATABASE_URL_PROD in .env');
  process.exit(1);
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('SQL executed successfully');
  } catch (e) {
    console.error('SQL execution failed:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
