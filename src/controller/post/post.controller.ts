import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { insertPost, getUserPosts, getFeed } from '../../db/post/post.query.js';

const createPostSchema = z.object({
  text: z.string().max(500),
  mediaUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
});

export async function createPost(req: Request, res: Response) {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { text, mediaUrl } = parsed.data;
  const id = uuid();
  const authorId = (req as any).user.id as string;
  try {
    const row = await insertPost(id, authorId, text, mediaUrl ?? undefined);
    return res.status(201).json({
      id: row.id,
      authorId: row.author_id,
      text: row.text,
      mediaUrl: row.media_url,
      createdAt: row.created_at,
    });
  } catch {
    return res.status(500).json({ error: 'Failed to create post' });
  }
}

export async function listUserPosts(req: Request, res: Response) {
  const id = req.params.id;
  const limit = Number(req.query.limit ?? 20);
  const cursor = req.query.cursor as string | undefined;
  try {
    const rows = await getUserPosts(id, limit, cursor);
    const items = rows.map(r => ({
      id: r.id,
      authorId: r.author_id,
      text: r.text,
      mediaUrl: r.media_url,
      createdAt: r.created_at,
    }));
    return res.json({ items, nextCursor: items.length ? items[items.length - 1].createdAt : null });
  } catch {
    return res.status(500).json({ error: 'Failed to load posts' });
  }
}

export async function feedForMe(req: Request, res: Response) {
  const me = (req as any).user.id as string;
  const limit = Number(req.query.limit ?? 20);
  const cursor = req.query.cursor as string | undefined;
  try {
    const rows = await getFeed(me, limit, cursor);
    const items = rows.map(r => ({
      id: r.id,
      authorId: r.author_id,
      text: r.text,
      mediaUrl: r.media_url,
      createdAt: r.created_at,
    }));
    return res.json({ items, nextCursor: items.length ? items[items.length - 1].createdAt : null });
  } catch {
    return res.status(500).json({ error: 'Failed to load feed' });
  }
}
