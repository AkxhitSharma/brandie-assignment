import client from '../../config/postgres.js';

export async function insertFollower(followerId: string, followeeId: string) {
  await client.query(
    'INSERT INTO follows (follower_id, followee_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [followerId, followeeId]
  );
}

export async function deleteFollower(followerId: string, followeeId: string) {
  await client.query('DELETE FROM follows WHERE follower_id=$1 AND followee_id=$2', [followerId, followeeId]);
}

export async function getUserById(userId: string) {
  const { rows } = await client.query(
    'SELECT id, username, email FROM users WHERE id=$1',
    [userId]
  );
  return rows[0] || null;
}

export async function countFollowers(userId: string) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM follows WHERE followee_id=$1', [userId]);
  return (rows[0]?.n as number) ?? 0;
}

export async function countPosts(userId: string) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM posts WHERE author_id=$1', [userId]);
  return (rows[0]?.n as number) ?? 0;
}

export async function listFollowersDetailed(userId: string) {
  const { rows } = await client.query(
    `SELECT f.created_at,
            uf.id   AS follower_id, uf.username AS follower_username, uf.email AS follower_email,
            ue.id   AS followee_id, ue.username AS followee_username, ue.email AS followee_email
     FROM follows f
     JOIN users uf ON f.follower_id = uf.id
     JOIN users ue ON f.followee_id = ue.id
     WHERE f.followee_id=$1
     ORDER BY uf.username ASC`,
    [userId]
  );
  return rows;
}

export async function listFollowingDetailed(userId: string) {
  const { rows } = await client.query(
    `SELECT f.created_at,
            ue.id   AS followee_id, ue.username AS followee_username, ue.email AS followee_email,
            uf.id   AS follower_id, uf.username AS follower_username, uf.email AS follower_email
     FROM follows f
     JOIN users uf ON f.follower_id = uf.id
     JOIN users ue ON f.followee_id = ue.id
     WHERE f.follower_id=$1
     ORDER BY ue.username ASC`,
    [userId]
  );
  return rows;
}

export async function listFollowers(userId: string) {
  const { rows } = await client.query(
    `SELECT u.id, u.username
     FROM follows f JOIN users u ON f.follower_id = u.id
     WHERE f.followee_id=$1
     ORDER BY u.username ASC`,
    [userId]
  );
  return rows;
}

export async function listFollowing(userId: string) {
  const { rows } = await client.query(
    `SELECT u.id, u.username
     FROM follows f JOIN users u ON f.followee_id = u.id
     WHERE f.follower_id=$1
     ORDER BY u.username ASC`,
    [userId]
  );
  return rows;
}