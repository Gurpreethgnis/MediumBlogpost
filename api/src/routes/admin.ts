import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Get audit logs
router.get('/audit', requireAuth, requireAdmin, (req, res) => {
  // TODO: Implement audit log viewing
  res.json({ message: 'Admin audit endpoint - to be implemented' });
});

export { router as adminRoutes };
