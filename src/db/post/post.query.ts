import client from '../../config/postgres.js';

export async function insertPost(id: string, authorId: string, text: string, mediaUrl?: string | null) {
  const { rows } = await client.query(
    'INSERT INTO posts (id, author_id, text, media_url) VALUES ($1,$2,$3,$4) RETURNING id, author_id, text, media_url, created_at',
    [id, authorId, text, mediaUrl ?? null]
  );
  return rows[0];
}

export async function getUserPosts(authorId: string, limit: number, cursor?: string) {
  const params: any[] = [authorId];
  let where = 'WHERE author_id=$1';
  if (cursor) {
    params.push(cursor);
    where += ` AND created_at < $${params.length}`;
  }
  params.push(limit);
  const { rows } = await client.query(
    `SELECT id, author_id, text, media_url, created_at
     FROM posts ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length}`,
    params
  );
  return rows;
}

export async function getFeed(me: string, limit: number, cursor?: string) {
  const params: any[] = [me, me];
  let where = 'WHERE (p.author_id = $1 OR p.author_id IN (SELECT followee_id FROM follows WHERE follower_id=$2))';
  if (cursor) {
    params.push(cursor);
    where += ` AND p.created_at < $${params.length}`;
  }
  params.push(limit);
  const { rows } = await client.query(
    `SELECT p.id, p.author_id, u.username, p.text, p.media_url, p.created_at
     FROM posts p JOIN users u ON p.author_id = u.id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT $${params.length}`,
    params
  );
  return rows;
}
