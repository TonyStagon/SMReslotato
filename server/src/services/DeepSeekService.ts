import { logger } from '../utils/logger';

export function isDeepSeekResponse(response: unknown): response is DeepSeekResponse {
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const r = response as Record<string, unknown>;
  if (!('choices' in r) || !Array.isArray(r.choices)) {
    return false;
  }

  const firstChoice = r.choices[0] as Record<string, unknown>;
  return typeof firstChoice?.message === 'object' &&
    firstChoice.message !== null &&
    typeof (firstChoice.message as Record<string, unknown>)?.content === 'string';
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeepSeekService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    
    if (!this.apiKey || this.apiKey.trim() === '') {
      logger.warn('DeepSeek API key not configured - AI features will be disabled');
    } else {
      logger.info('DeepSeek API service initialized successfully');
    }
  }

  async generateCaption(
    keywords: string,
    platforms: string[],
    tone: 'professional' | 'casual' | 'engaging' = 'engaging',
    language: string = 'en'
  ): Promise<string> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const platformInfo = platforms.map(p => {
        switch (p) {
          case 'instagram': return 'Instagram (visual-focused, hashtags)';
          case 'facebook': return 'Facebook (community-focused)';
          case 'twitter': return 'Twitter/X (concise, trending)';
          case 'linkedin': return 'LinkedIn (professional)';
          case 'tiktok': return 'TikTok (creative, viral)';
          default: return p;
        }
      }).join(', ');

      const prompt = `Generate an engaging social media caption for ${platformInfo} about "${keywords}".

Requirements:
- Tone: ${tone}
- Language: ${language}
- Include relevant emojis
- Make it platform-appropriate
- Keep it engaging and authentic
- Include call-to-action if appropriate

Generate only the caption text, no additional formatting or explanations.`;

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!isDeepSeekResponse(data)) {
        throw new Error('Invalid API response format');
      }
      
      const caption = data.choices[0].message.content.trim();

      if (!caption) {
        throw new Error('No caption generated');
      }

      logger.info('Caption generated successfully', { keywords, platforms });
      return caption;
    } catch (error) {
      logger.error('Error generating caption:', error);
      throw error;
    }
  }

  async generateHashtags(
    keywords: string,
    platforms: string[],
    count: number = 10,
    language: string = 'en'
  ): Promise<string[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const prompt = `Generate ${count} relevant hashtags for social media posts about "${keywords}" for platforms: ${platforms.join(', ')}.

Requirements:
- Language: ${language}
- Mix of popular and niche hashtags
- Platform-appropriate
- No spaces in hashtags
- Include # symbol

Return only the hashtags separated by spaces, no additional text.`;

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 200,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!isDeepSeekResponse(data)) {
        throw new Error('Invalid API response format');
      }
      
      const hashtagText = data.choices[0].message.content.trim();

      if (!hashtagText) {
        throw new Error('No hashtags generated');
      }

      const hashtags = hashtagText
        .split(/\s+/)
        .filter(tag => tag.startsWith('#'))
        .slice(0, count);

      logger.info('Hashtags generated successfully', { keywords, count: hashtags.length });
      return hashtags;
    } catch (error) {
      logger.error('Error generating hashtags:', error);
      throw error;
    }
  }

  async improveCaption(
    originalCaption: string,
    platforms: string[],
    language: string = 'en'
  ): Promise<string> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const prompt = `Improve this social media caption for ${platforms.join(', ')}:

"${originalCaption}"

Requirements:
- Language: ${language}
- Make it more engaging and compelling
- Optimize for the specified platforms
- Keep the original meaning
- Add appropriate emojis if missing
- Improve readability and flow

Return only the improved caption, no additional text.`;

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!isDeepSeekResponse(data)) {
        throw new Error('Invalid API response format');
      }
      
      const improvedCaption = data.choices[0].message.content.trim();

      if (!improvedCaption) {
        throw new Error('No improved caption generated');
      }

      logger.info('Caption improved successfully');
      return improvedCaption;
    } catch (error) {
      logger.error('Error improving caption:', error);
      throw error;
    }
  }

  async translateCaption(
    caption: string,
    targetLanguage: string
  ): Promise<string> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const prompt = `Translate this social media caption to ${targetLanguage}, keeping the tone and emojis appropriate:

"${caption}"

Return only the translated caption, no additional text.`;

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!isDeepSeekResponse(data)) {
        throw new Error('Invalid API response format');
      }
            
      const translatedCaption = data.choices[0].message.content.trim();

      if (!translatedCaption) {
        throw new Error('No translation generated');
      }

      logger.info('Caption translated successfully', { targetLanguage });
      return translatedCaption;
    } catch (error) {
      logger.error('Error translating caption:', error);
      throw error;
    }
  }
}

export const deepSeekService = new DeepSeekService();