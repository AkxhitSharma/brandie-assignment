import { Router } from 'express';
import { authRequired } from '../../middleware/auth.js';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../../controller/user/user.controller.js';

const router = Router();

// Follow a user
router.post('/:id/follow', authRequired, followUser);

// Unfollow
router.delete('/:id/follow', authRequired, unfollowUser);

// Followers list
router.get('/:id/followers', authRequired, listFollowers);

// Following list
router.get('/:id/following', authRequired, listFollowing);

export default router;
