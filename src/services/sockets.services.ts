import { NewCommentReqBody } from '~/types/requests/comment'
import commentService from './comments.services'

export const socketServices = (socket: any) => {
  console.log('connection')

  // Comment
  socket.on('join-article', (articleId: string) => {
    socket.join(articleId)
    console.log(`User joined article: ${articleId}`)
  })

  socket.on('leave-article', (articleId: string) => {
    socket.leave(articleId)
    console.log(`User left article: ${articleId}`)
  })

  socket.on('send-comment', async (data: NewCommentReqBody) => {
    const comment = await commentService.createComment(data)
    ;(global as any).socket.to(data.article).emit('receive-comment', comment)
  })

  socket.on('disconnect', async () => {
    console.log('disconnect')
  })
}
