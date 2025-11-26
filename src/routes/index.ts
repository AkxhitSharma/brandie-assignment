import express from 'express';
import authRouter from './auth/auth.routes.js';
import userRouter from './user/user.routes.js';
import postRouter from './post/post.routes.js';

const router = express.Router();

router.get('/health', (_req: express.Request, res: express.Response) => res.json({ ok: true }));
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/posts', postRouter);

export default router;
