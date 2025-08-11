import Bull from 'bull';
import { logger } from '../utils/logger';
import { JobData, BrowserAutomationResult } from '../types';
import { browserAutomation } from './BrowserAutomation';
import { Post } from '../models/Post';
import { AutomationSettings } from '../models/AutomationSettings';

// Parse Redis URL for Bull queue
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisConfig: any;

if (redisUrl.startsWith('redis://')) {
  const url = new URL(redisUrl);
  redisConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 6379,
    password: url.password || undefined,
  };
} else {
  redisConfig = {
    host: 'localhost',
    port: 6379,
  };
}

export const postQueue = new Bull('post publishing', {
  redis: redisConfig,
});

postQueue.process('publishPost', async (job) => {
  const jobData: JobData = job.data;
  logger.info('Processing post job', { postId: jobData.postId });

  try {
    // Get user's automation settings
    const settings = await AutomationSettings.findOne({ userId: jobData.userId });
    if (!settings || !settings.isEnabled) {
      throw new Error('Automation is disabled for this user');
    }

    // Get the post from database
    const post = await Post.findOne({ id: jobData.postId, userId: jobData.userId });
    if (!post) {
      throw new Error('Post not found');
    }

    // Update post status to publishing
    post.status = 'scheduled';
    await post.save();

    const results: BrowserAutomationResult[] = [];
    let totalAnalytics = {
      reach: 0,
      likes: 0,
      comments: 0,
      impressions: 0,
    };

    // Post to each platform
    for (const platform of jobData.platforms) {
      let result: BrowserAutomationResult;

      switch (platform) {
        case 'instagram':
          result = await browserAutomation.postToInstagram(jobData, settings.browserType);
          break;
        case 'facebook':
          result = await browserAutomation.postToFacebook(jobData, settings.browserType);
          break;
        case 'twitter':
          result = await browserAutomation.postToTwitter(jobData, settings.browserType);
          break;
        case 'linkedin':
          result = await browserAutomation.postToLinkedIn(jobData, settings.browserType);
          break;
        case 'tiktok':
          result = await browserAutomation.postToTikTok(jobData, settings.browserType);
          break;
        default:
          result = {
            success: false,
            platform,
            message: `Unsupported platform: ${platform}`,
            error: 'Platform not supported',
          };
      }

      results.push(result);

      if (result.success && result.analytics) {
        totalAnalytics.reach += result.analytics.reach;
        totalAnalytics.likes += result.analytics.likes;
        totalAnalytics.comments += result.analytics.comments;
        totalAnalytics.impressions += result.analytics.impressions;
      }
    }

    // Check if all platforms succeeded
    const allSucceeded = results.every(r => r.success);
    const someSucceeded = results.some(r => r.success);

    // Update post status and analytics
    if (allSucceeded) {
      post.status = 'published';
      post.analytics = totalAnalytics;
    } else if (someSucceeded) {
      post.status = 'published'; // Partial success
      post.analytics = totalAnalytics;
      post.errorMessage = `Failed on: ${results.filter(r => !r.success).map(r => r.platform).join(', ')}`;
    } else {
      post.status = 'failed';
      post.errorMessage = results.map(r => `${r.platform}: ${r.error || r.message}`).join('; ');
    }

    await post.save();

    logger.info('Post job completed', {
      postId: jobData.postId,
      status: post.status,
      platforms: jobData.platforms,
      results: results.map(r => ({ platform: r.platform, success: r.success })),
    });

    return {
      success: allSucceeded || someSucceeded,
      results,
      analytics: totalAnalytics,
    };
  } catch (error) {
    logger.error('Post job failed', { postId: jobData.postId, error });

    // Update post status to failed
    try {
      const post = await Post.findOne({ id: jobData.postId, userId: jobData.userId });
      if (post) {
        post.status = 'failed';
        post.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await post.save();
      }
    } catch (updateError) {
      logger.error('Failed to update post status', { postId: jobData.postId, error: updateError });
    }

    throw error;
  }
});

postQueue.on('completed', (job, result) => {
  logger.info('Job completed', { jobId: job.id, result });
});

postQueue.on('failed', (job, err) => {
  logger.error('Job failed', { jobId: job.id, error: err });
});

postQueue.on('stalled', (job) => {
  logger.warn('Job stalled', { jobId: job.id });
});

export const addPostToQueue = async (jobData: JobData, delay?: number): Promise<Bull.Job> => {
  const options: Bull.JobOptions = {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 5,
  };

  if (delay) {
    options.delay = delay;
  }

  return postQueue.add('publishPost', jobData, options);
};