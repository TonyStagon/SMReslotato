import express from 'express';
import { browserAutomation } from '../services/BrowserAutomation';
import { logger } from '../utils/logger';

const router = express.Router();

// Facebook posting endpoint
router.post('/facebook', async (req, res) => {
  try {
    const { caption, media, headlessMode = true } = req.body;

    if (!caption) {
      return res.status(400).json({ 
        success: false, 
        message: 'Caption is required' 
      });
    }

    logger.info('Starting Facebook post automation', { 
      captionLength: caption.length,
      hasMedia: !!media,
      headlessMode 
    });

    // Post to Facebook using browser automation
    const result = await browserAutomation.postToFacebook({
      postId: Date.now().toString(),
      userId: 'demo-user',
      platforms: ['facebook'],
      caption,
      media: media ? [media] : [],
    }, 'puppeteer', headlessMode);

    if (result.success) {
      logger.info('Facebook post completed successfully');
      res.json({
        success: true,
        message: 'Post successfully published to Facebook',
        result
      });
    } else {
      logger.error('Facebook post failed', { error: result.error });
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to post to Facebook',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Facebook posting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;