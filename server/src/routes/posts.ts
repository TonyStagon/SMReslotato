import express from 'express';
import { Post } from '../models/Post';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// Updated GET /:id handler with correct parameter handling
router.get('/:id', authenticateToken, async (req: AuthRequest & { params: { id: string } }, res: Response) => {
  try {
    const post = await Post.findOne({
      id: String(req.params.id),
      userId: String(req.user.id)
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    logger.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// All other routes would follow same pattern...
export default router; 