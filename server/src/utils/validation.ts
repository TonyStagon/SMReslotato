import { Post } from '../types';

export const validatePost = (post: Partial<Post>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!post.caption || post.caption.trim().length === 0) {
    errors.push('Caption is required');
  }

  if (!post.platforms || post.platforms.length === 0) {
    errors.push('At least one platform must be selected');
  }

  if (post.platforms) {
    const validPlatforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
    const invalidPlatforms = post.platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
    }
  }

  if (post.scheduledDate && new Date(post.scheduledDate) <= new Date()) {
    errors.push('Scheduled date must be in the future');
  }

  if (post.media && !isValidUrl(post.media)) {
    errors.push('Media URL is not valid');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeCaption = (caption: string): string => {
  return caption.trim().replace(/\s+/g, ' ');
};

export const getCharacterLimit = (platforms: string[]): number => {
  const limits: Record<string, number> = {
    instagram: 2200,
    facebook: 63206,
    twitter: 280,
    linkedin: 3000,
    tiktok: 150,
  };

  const platformLimits = platforms.map(p => limits[p] || 2200);
  return Math.min(...platformLimits);
};