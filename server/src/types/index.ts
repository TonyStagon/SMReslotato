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
  _id?: string;
  id: string;
  caption: string;
  media?: string;
  platforms: string[];
  scheduledDate?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  analytics?: {
    reach: number;
    likes: number;
    comments: number;
    impressions: number;
  };
  errorMessage?: string;
}

export interface User {
  _id?: string;
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  socialAccounts: SocialAccount[];
}

export interface SocialAccount {
  platform: string;
  username: string;
  isConnected: boolean;
  credentials?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  lastUsed?: Date;
}

export interface AutomationSettings {
  userId: string;
  isEnabled: boolean;
  browserType: 'puppeteer' | 'playwright';
  headlessMode: boolean;
  retryAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobData {
  postId: string;
  userId: string;
  platforms: string[];
  caption: string;
  media?: string;
  retryCount?: number;
}

export interface BrowserAutomationResult {
  success: boolean;
  platform: string;
  message: string;
  analytics?: {
    reach: number;
    likes: number;
    comments: number;
    impressions: number;
  };
  error?: string;
}