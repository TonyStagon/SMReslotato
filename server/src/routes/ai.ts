import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { deepSeekService } from '../services/DeepSeekService';
import { logger } from '../utils/logger';

const router = express.Router();

// Generate caption using AI
router.post('/generate-caption', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { keywords, platforms, tone = 'engaging', language = 'en' } = req.body;

    if (!keywords || !platforms || platforms.length === 0) {
      return res.status(400).json({ error: 'Keywords and platforms are required' });
    }

    const caption = await deepSeekService.generateCaption(keywords, platforms, tone, language);

    res.json({
      success: true,
      caption,
      metadata: {
        keywords,
        platforms,
        tone,
        language,
      },
    });
  } catch (error) {
    logger.error('Error generating caption:', error);
    res.status(500).json({ 
      error: 'Failed to generate caption',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate hashtags using AI
router.post('/generate-hashtags', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { keywords, platforms, count = 10, language = 'en' } = req.body;

    if (!keywords || !platforms || platforms.length === 0) {
      return res.status(400).json({ error: 'Keywords and platforms are required' });
    }

    const hashtags = await deepSeekService.generateHashtags(keywords, platforms, count, language);

    res.json({
      success: true,
      hashtags,
      metadata: {
        keywords,
        platforms,
        count: hashtags.length,
        language,
      },
    });
  } catch (error) {
    logger.error('Error generating hashtags:', error);
    res.status(500).json({ 
      error: 'Failed to generate hashtags',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Improve existing caption
router.post('/improve-caption', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { caption, platforms, language = 'en' } = req.body;

    if (!caption || !platforms || platforms.length === 0) {
      return res.status(400).json({ error: 'Caption and platforms are required' });
    }

    const improvedCaption = await deepSeekService.improveCaption(caption, platforms, language);

    res.json({
      success: true,
      originalCaption: caption,
      improvedCaption,
      metadata: {
        platforms,
        language,
      },
    });
  } catch (error) {
    logger.error('Error improving caption:', error);
    res.status(500).json({ 
      error: 'Failed to improve caption',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Translate caption
router.post('/translate-caption', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { caption, targetLanguage } = req.body;

    if (!caption || !targetLanguage) {
      return res.status(400).json({ error: 'Caption and target language are required' });
    }

    const translatedCaption = await deepSeekService.translateCaption(caption, targetLanguage);

    res.json({
      success: true,
      originalCaption: caption,
      translatedCaption,
      targetLanguage,
    });
  } catch (error) {
    logger.error('Error translating caption:', error);
    res.status(500).json({ 
      error: 'Failed to translate caption',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get supported languages
router.get('/languages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
    ];

    res.json({
      success: true,
      languages,
    });
  } catch (error) {
    logger.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

export default router;