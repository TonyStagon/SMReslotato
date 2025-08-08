import { SocialPlatform, Post } from '../types';
import { Instagram, Facebook, Twitter, Linkedin, Music } from 'lucide-react';

export const socialPlatforms: SocialPlatform[] = [
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

export const mockPosts: Post[] = [
  {
    id: '1',
    caption: 'Excited to share our latest product launch! 🚀 #innovation #tech',
    media: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    platforms: ['instagram', 'facebook', 'linkedin'],
    scheduledDate: new Date(2025-1-20),
    status: 'scheduled',
    createdAt: new Date(2025-1-19),
    analytics: {
      reach: 0,
      likes: 0,
      comments: 0,
      impressions: 0,
    },
  },
  {
    id: '2',
    caption: 'Behind the scenes at our office! Great team collaboration. 💪',
    media: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    platforms: ['instagram', 'twitter'],
    status: 'published',
    createdAt: new Date(2025-1-18),
    analytics: {
      reach: 1250,
      likes: 89,
      comments: 12,
      impressions: 3400,
    },
  },
  {
    id: '3',
    caption: 'New blog post is live! Check it out 📝',
    platforms: ['twitter', 'linkedin'],
    status: 'failed',
    createdAt: new Date(2025-1-17),
    analytics: {
      reach: 0,
      likes: 0,
      comments: 0,
      impressions: 0,
    },
  },
];