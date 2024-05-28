import { Comment } from '~/models/comment.model'
import { NewCommentReqBody } from '~/types/requests/comment'

class CommentService {
  async createComment(body: NewCommentReqBody) {
    const populateOptions = [
      { path: 'article', select: '_id title' },
      { path: 'author', select: '_id name avatar username' }
    ]

    const message = (await Comment.create(body)).populate(populateOptions)

    return message
  }
}

const commentService = new CommentService()
export default commentService
