import client from '../../config/postgres.js';

export async function findUserByUsernameOrEmail(usernameOrEmail: string) {
  const { rows } = await client.query(
    'SELECT id, username, email, password_hash FROM users WHERE username=$1 OR email=$1',
    [usernameOrEmail]
  );
  return rows[0] || null;
}

export async function userExistsByUsernameOrEmail(username: string, email: string) {
  const existing = await client.query('SELECT 1 FROM users WHERE username=$1 OR email=$2', [username, email]);
  return (existing.rowCount ?? 0) > 0;
}

export async function insertUser(id: string, username: string, email: string, password_hash: string) {
  await client.query(
    'INSERT INTO users (id, username, email, password_hash) VALUES ($1,$2,$3,$4)',
    [id, username, email, password_hash]
  );
}
