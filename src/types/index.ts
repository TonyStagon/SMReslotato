export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  maxChars: number;
  supportsHashtags: boolean;
  supportsMedia: boolean;
}

export interface Post {
  id: string;
  caption: string;
  media?: string;
  platforms: string[];
  scheduledDate?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  createdAt: Date;
  analytics?: {
    reach: number;
    likes: number;
    comments: number;
    impressions: number;
  };
}

export interface AIGeneration {
  captions: string[];
  hashtags: string[];
  isGenerating: boolean;
}

export interface AutomationSettings {
  isEnabled: boolean;
  browserType: 'puppeteer' | 'playwright';
  headlessMode: boolean;
  retryAttempts: number;
}