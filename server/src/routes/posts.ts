import express from 'express';
import { Post } from '../models/Post';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { postLimiter } from '../middleware/rateLimiter';
import { validatePost, sanitizeCaption } from '../utils/validation';
import { addPostToQueue } from '../services/JobQueue';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all posts for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    const filter: any = { userId: req.user.id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string));

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: total > parseInt(offset as string) + parseInt(limit as string),
      },
    });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single post
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id, userId: req.user.id });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    logger.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new post
router.post('/', authenticateToken, postLimiter, async (req: AuthRequest, res) => {
  try {
    const { caption, media, platforms, scheduledDate } = req.body;

    // Validate post data
    const validation = validatePost({ caption, media, platforms, scheduledDate });
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    // Create post
    const post = new Post({
      id: Date.now().toString(),
      caption: sanitizeCaption(caption),
      media,
      platforms,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      status: scheduledDate ? 'scheduled' : 'published',
      userId: req.user.id,
      analytics: {
        reach: 0,
        likes: 0,
        comments: 0,
        impressions: 0,
      },
    });

    await post.save();

    // Add to job queue
    const jobData = {
      postId: post.id,
      userId: req.user.id,
      platforms,
      caption: post.caption,
      media: post.media,
    };

    if (scheduledDate) {
      // Schedule for later
      const delay = new Date(scheduledDate).getTime() - Date.now();
      await addPostToQueue(jobData, delay);
    } else {
      // Post immediately
      await addPostToQueue(jobData);
    }

    logger.info('Post created and queued', { postId: post.id, userId: req.user.id });

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { caption, media, platforms, scheduledDate } = req.body;

    const post = await Post.findOne({ id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only allow editing of draft or scheduled posts
    if (post.status === 'published') {
      return res.status(400).json({ error: 'Cannot edit published posts' });
    }

    // Validate updated data
    const validation = validatePost({ caption, media, platforms, scheduledDate });
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    // Update post
    post.caption = sanitizeCaption(caption);
    post.media = media;
    post.platforms = platforms;
    post.scheduledDate = scheduledDate ? new Date(scheduledDate) : undefined;
    post.status = scheduledDate ? 'scheduled' : 'draft';

    await post.save();

    logger.info('Post updated', { postId: post.id, userId: req.user.id });

    res.json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    logger.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.deleteOne({ id: req.params.id, userId: req.user.id });

    logger.info('Post deleted', { postId: req.params.id, userId: req.user.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get post analytics
router.get('/:id/analytics', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id, userId: req.user.id });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.status !== 'published') {
      return res.status(400).json({ error: 'Analytics only available for published posts' });
    }

    res.json({
      postId: post.id,
      analytics: post.analytics,
      platforms: post.platforms,
      publishedAt: post.createdAt,
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;