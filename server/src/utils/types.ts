export type PostStatus = 
  | 'draft'
  | 'published'  
  | 'archived'
  | 'failed'
  | 'scheduled';

export interface PostStatusResponse {
  status: PostStatus;
}