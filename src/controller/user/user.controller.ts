import { insertFollower, deleteFollower, listFollowersDetailed, listFollowingDetailed } from '../../db/user/user.query.js';

export async function followUser(req: any, res: any) {
  const targetId = req.params.id;
  const me = (req as any).user.id as string;
  if (me === targetId) return res.status(400).json({ error: "Can't follow yourself" });
  try {
    await insertFollower(me, targetId) 
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to follow' });
  }
}

export async function unfollowUser(req: any, res: any) {
  const targetId = req.params.id;
  const me = (req as any).user.id as string;
  try {
    await deleteFollower(me, targetId);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to unfollow' });
  }
}

export async function listFollowers(req: any, res: any) {
  const id = req.params.id;
  try {
    const rows = await listFollowersDetailed(id);
    const items = rows.map((r: any) => ({
      follower: { id: r.follower_id, username: r.follower_username, email: r.follower_email, password_hash: undefined as any },
      followee: { id: r.followee_id, username: r.followee_username, email: r.followee_email, password_hash: undefined as any },
      createdAt: r.created_at,
    }));
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to load followers' });
  }
}

export async function listFollowing(req: any, res: any) {
  const id = req.params.id;
  try {
    const rows = await listFollowingDetailed(id);
    const items = rows.map((r: any) => ({
      follower: { id: r.follower_id, username: r.follower_username, email: r.follower_email, password_hash: undefined as any },
      followee: { id: r.followee_id, username: r.followee_username, email: r.followee_email, password_hash: undefined as any },
      createdAt: r.created_at,
    }));
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to load following' });
  }
}
