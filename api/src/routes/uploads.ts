import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get presigned URL for upload
router.post('/presign', requireAuth, (req, res) => {
  // TODO: Implement presigned upload URLs
  res.json({ message: 'Upload presign endpoint - to be implemented' });
});

export { router as uploadRoutes };
