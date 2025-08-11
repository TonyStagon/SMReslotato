import cron from 'node-cron';
import { Post } from '../models/Post';
import { addPostToQueue } from './JobQueue';
import { logger } from '../utils/logger';

export class SchedulerService {
  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    // Run every minute to check for scheduled posts
    cron.schedule('* * * * *', async () => {
      await this.processScheduledPosts();
    });

    this.isRunning = true;
    logger.info('Scheduler service started');
  }

  stop(): void {
    this.isRunning = false;
    logger.info('Scheduler service stopped');
  }

  private async processScheduledPosts(): Promise<void> {
    try {
      const now = new Date();
      
      // Find posts that are scheduled and due for publishing
      const duePosts = await Post.find({
        status: 'scheduled',
        scheduledDate: { $lte: now },
      });

      logger.info(`Found ${duePosts.length} posts due for publishing`);

      for (const post of duePosts) {
        try {
          // Add to job queue for processing
          await addPostToQueue({
            postId: post.id,
            userId: post.userId,
            platforms: post.platforms,
            caption: post.caption,
            media: post.media,
          });

          logger.info('Added scheduled post to queue', { postId: post.id });
        } catch (error) {
          logger.error('Failed to add scheduled post to queue', {
            postId: post.id,
            error,
          });

          // Update post status to failed
          post.status = 'failed';
          post.errorMessage = 'Failed to add to processing queue';
          await post.save();
        }
      }
    } catch (error) {
      logger.error('Error processing scheduled posts:', error);
    }
  }

  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    try {
      const { postQueue } = await import('./JobQueue');
      
      const [waiting, active, completed, failed] = await Promise.all([
        postQueue.getWaiting(),
        postQueue.getActive(),
        postQueue.getCompleted(),
        postQueue.getFailed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      };
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      return { waiting: 0, active: 0, completed: 0, failed: 0 };
    }
  }
}

export const schedulerService = new SchedulerService();