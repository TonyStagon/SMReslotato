import express from 'express'
import { Post } from '../models/Post'
import { authenticateToken, AuthRequest } from '../middleware/auth'

type PostStatus = 'draft' | 'published' | 'scheduled' | 'failed'

interface StatusUpdateRequest {
  status: PostStatus
}

interface PostResponse {
  id: string
  title: string 
  status: PostStatus
  content: string
}

const router = express.Router()

router.post('/:id/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body as StatusUpdateRequest
    const { id } = req.params

    // Check if post exists and status is valid
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      })
    }

    // Validate status transition  
    if (!Post.validateStatusTransition(post.status, status)) {
      return res.status(400).json({
        message: `Cannot transition from ${post.status} to ${status}`  
      })
    }

    // Update post status
    post.status = status
    await post.save()

    return res.json({
      id: post._id.toString(),
      title: post.title || '',
      status,
      content: post.content || ''
    } satisfies PostResponse)
  } catch (error) {   
    return res.status(500).json({
      message: 'Failed to update post status'
    })
  }
})

// Get all posts for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// Create new post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { caption, platforms, media, scheduledDate } = req.body

    if (!caption || !platforms || platforms.length === 0) {
      return res.status(400).json({ error: 'Caption and platforms are required' })
    }

    const post = new Post({
      caption,
      platforms,
      media: media || [],
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      status: scheduledDate ? 'scheduled' : 'draft',
      userId: req.user.id,
    })

    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// Delete post
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router;