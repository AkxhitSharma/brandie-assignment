import { Router } from 'express';
import { authRequired } from '../../middleware/auth.js';
import { createPost, listUserPosts, feedForMe } from '../../controller/post/post.controller.js';

const router = Router();

router.post('/', authRequired, createPost);

// all posts for a user
router.get('/user/:id', listUserPosts);

// timeline feed for current user (followed authors + self)
router.get('/feed/me', authRequired, feedForMe);

export default router;
