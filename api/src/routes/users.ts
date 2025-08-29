import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', requireAuth, (req, res) => {
  // TODO: Implement profile update
  res.json({ message: 'Profile update endpoint - to be implemented' });
});

export { router as userRoutes };
