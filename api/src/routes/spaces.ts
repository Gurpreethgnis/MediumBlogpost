import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get all spaces
router.get('/', requireAuth, (req, res) => {
  // TODO: Implement spaces listing
  res.json({ message: 'Spaces endpoint - to be implemented' });
});

export { router as spaceRoutes };
