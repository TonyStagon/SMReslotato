export interface Post {
  id: string;
  caption: string;
  media?: string;
  platforms: string[];
  status: 'draft' | 'published' | 'failed';
  createdAt: Date;
}