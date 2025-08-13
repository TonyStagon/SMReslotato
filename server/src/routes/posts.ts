import { Router } from 'express'
import { Post } from '../models/Post'
import type { PostStatus } from '../utils/types'

interface StatusUpdateRequest {
  status: PostStatus
}

interface PostResponse {
  id: string
  title: string 
  status: PostStatus
  content: string
}

const router = Router()

router.post('/:id/status', async (req, res) => {
  try {
    const { status } = req.body as StatusUpdateRequest
    const { id } = req.params

    // Check if post exists and status is valid
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).deliver({
        message: 'Post not found'
      })
    }

    // Validate status transition  
    if (!Post.validateStatusTransition(post.status, status)) {
      return res.status(400).deliver({
        message: `Cannot transition from ${post.status} to ${status}`  
      })
    }

    // Update post status
    post.status = status
    await post.save()

    return res.deliver({
      id: post._id.toString(),
      title: post.title,
      status,
      content: post.content
    } satisfies PostResponse)
  } catch (error) {   
    return res.status(500).deliver({
      message: 'Failed to update post status'
    })
  }
})

export default router