import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../middleware/auth.js';
import { findUserByUsernameOrEmail, userExistsByUsernameOrEmail, insertUser } from '../../db/auth/auth.query.js';
import { countFollowers, countPosts } from '../../db/user/user.query.js';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { username, email, password } = parsed.data;
  try {
    const exists = await userExistsByUsernameOrEmail(username, email);
    if (exists) return res.status(409).json({ error: 'Username or email already exists' });
    const id = uuid();
    const password_hash = await hashPassword(password);
    await insertUser(id, username, email, password_hash);
    const token = signToken({ id, username });
    const totalFollowers = await countFollowers(id);
    const totalPosts = await countPosts(id);
    return res.status(201).json({ token, user: { id, username, email, totalFollowers, totalPosts } });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to register' });
  }
}

const loginSchema = z.object({
  usernameOrEmail: z.string(),
  password: z.string(),
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { usernameOrEmail, password } = parsed.data;
  try {
    const user = await findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, username: user.username });
    const totalFollowers = await countFollowers(user.id);
    const totalPosts = await countPosts(user.id);
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, totalFollowers, totalPosts } });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to login' });
  }
}
