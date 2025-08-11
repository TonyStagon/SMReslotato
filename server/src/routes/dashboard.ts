import express from 'express';
import { Post } from '../models/Post';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;

    // Get post counts by status
    const [publishedCount, scheduledCount, failedCount, draftCount] = await Promise.all([
      Post.countDocuments({ userId, status: 'published' }),
      Post.countDocuments({ userId, status: 'scheduled' }),
      Post.countDocuments({ userId, status: 'failed' }),
      Post.countDocuments({ userId, status: 'draft' }),
    ]);

    // Get total analytics for published posts
    const publishedPosts = await Post.find({ userId, status: 'published' });
    
    const totalAnalytics = publishedPosts.reduce(
      (acc, post) => {
        if (post.analytics) {
          acc.reach += post.analytics.reach;
          acc.likes += post.analytics.likes;
          acc.comments += post.analytics.comments;
          acc.impressions += post.analytics.impressions;
        }
        return acc;
      },
      { reach: 0, likes: 0, comments: 0, impressions: 0 }
    );

    // Get recent posts
    const recentPosts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate engagement rate
    const engagementRate = totalAnalytics.impressions > 0 
      ? ((totalAnalytics.likes + totalAnalytics.comments) / totalAnalytics.impressions * 100).toFixed(2)
      : '0.00';

    res.json({
      postCounts: {
        published: publishedCount,
        scheduled: scheduledCount,
        failed: failedCount,
        draft: draftCount,
        total: publishedCount + scheduledCount + failedCount + draftCount,
      },
      analytics: {
        ...totalAnalytics,
        engagementRate: parseFloat(engagementRate),
      },
      recentPosts,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics over time
router.get('/analytics/timeline', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user.id;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const posts = await Post.find({
      userId,
      status: 'published',
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Group posts by date
    const timeline: Record<string, any> = {};
    
    posts.forEach(post => {
      const date = post.createdAt.toISOString().split('T')[0];
      
      if (!timeline[date]) {
        timeline[date] = {
          date,
          posts: 0,
          reach: 0,
          likes: 0,
          comments: 0,
          impressions: 0,
        };
      }
      
      timeline[date].posts += 1;
      if (post.analytics) {
        timeline[date].reach += post.analytics.reach;
        timeline[date].likes += post.analytics.likes;
        timeline[date].comments += post.analytics.comments;
        timeline[date].impressions += post.analytics.impressions;
      }
    });

    const timelineArray = Object.values(timeline);

    res.json({
      timeline: timelineArray,
      summary: {
        totalPosts: posts.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching analytics timeline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform performance
router.get('/analytics/platforms', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    
    const posts = await Post.find({ userId, status: 'published' });
    
    const platformStats: Record<string, any> = {};
    
    posts.forEach(post => {
      post.platforms.forEach(platform => {
        if (!platformStats[platform]) {
          platformStats[platform] = {
            platform,
            posts: 0,
            reach: 0,
            likes: 0,
            comments: 0,
            impressions: 0,
          };
        }
        
        platformStats[platform].posts += 1;
        if (post.analytics) {
          // Distribute analytics evenly across platforms for this post
          const platformCount = post.platforms.length;
          platformStats[platform].reach += Math.floor(post.analytics.reach / platformCount);
          platformStats[platform].likes += Math.floor(post.analytics.likes / platformCount);
          platformStats[platform].comments += Math.floor(post.analytics.comments / platformCount);
          platformStats[platform].impressions += Math.floor(post.analytics.impressions / platformCount);
        }
      });
    });

    const platformArray = Object.values(platformStats);

    res.json({
      platforms: platformArray,
      totalPlatforms: platformArray.length,
    });
  } catch (error) {
    logger.error('Error fetching platform analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;