import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Search posts
router.get('/', requireAuth, (req, res) => {
  // TODO: Implement full-text search
  res.json({ message: 'Search endpoint - to be implemented' });
});

export { router as searchRoutes };
