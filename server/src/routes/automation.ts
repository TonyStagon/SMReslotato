import express from 'express';
import { AutomationSettings } from '../models/AutomationSettings';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { schedulerService } from '../services/SchedulerService';
import { logger } from '../utils/logger';

const router = express.Router();

// Get automation settings
router.get('/settings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    let settings = await AutomationSettings.findOne({ userId: req.user.id });
    
    if (!settings) {
      // Create default settings
      settings = new AutomationSettings({
        userId: req.user.id,
        isEnabled: false,
        browserType: 'puppeteer',
        headlessMode: true,
        retryAttempts: 3,
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    logger.error('Error fetching automation settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update automation settings
router.put('/settings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { isEnabled, browserType, headlessMode, retryAttempts } = req.body;

    // Validate input
    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({ error: 'isEnabled must be a boolean' });
    }

    if (browserType && !['puppeteer', 'playwright'].includes(browserType)) {
      return res.status(400).json({ error: 'browserType must be either "puppeteer" or "playwright"' });
    }

    if (typeof headlessMode !== 'boolean') {
      return res.status(400).json({ error: 'headlessMode must be a boolean' });
    }

    if (retryAttempts && (retryAttempts < 1 || retryAttempts > 5)) {
      return res.status(400).json({ error: 'retryAttempts must be between 1 and 5' });
    }

    let settings = await AutomationSettings.findOne({ userId: req.user.id });
    
    if (!settings) {
      settings = new AutomationSettings({ userId: req.user.id });
    }

    settings.isEnabled = isEnabled;
    settings.browserType = browserType || settings.browserType;
    settings.headlessMode = headlessMode;
    settings.retryAttempts = retryAttempts || settings.retryAttempts;

    await settings.save();

    logger.info('Automation settings updated', { 
      userId: req.user.id, 
      isEnabled, 
      browserType: settings.browserType 
    });

    res.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    logger.error('Error updating automation settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get queue statistics
router.get('/queue/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const stats = await schedulerService.getQueueStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching queue stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supported platforms
router.get('/platforms', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const platforms = [
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'Instagram',
        color: 'from-purple-500 to-pink-500',
        maxChars: 2200,
        supportsHashtags: true,
        supportsMedia: true,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'Facebook',
        color: 'from-blue-600 to-blue-700',
        maxChars: 63206,
        supportsHashtags: true,
        supportsMedia: true,
      },
      {
        id: 'twitter',
        name: 'X (Twitter)',
        icon: 'Twitter',
        color: 'from-gray-800 to-black',
        maxChars: 280,
        supportsHashtags: true,
        supportsMedia: true,
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'Linkedin',
        color: 'from-blue-600 to-blue-800',
        maxChars: 3000,
        supportsHashtags: true,
        supportsMedia: true,
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'Music',
        color: 'from-red-500 to-pink-600',
        maxChars: 150,
        supportsHashtags: true,
        supportsMedia: true,
      },
    ];

    res.json(platforms);
  } catch (error) {
    logger.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;