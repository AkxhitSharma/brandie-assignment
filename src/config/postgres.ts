import { Client } from 'pg';
import {db} from './var.js'

const connectionString = db;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();
export default client; 