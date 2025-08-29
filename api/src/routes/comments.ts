import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get comments for a post
router.get('/:postId', requireAuth, (req, res) => {
  // TODO: Implement comments listing
  res.json({ message: 'Comments endpoint - to be implemented' });
});

export { router as commentRoutes };
