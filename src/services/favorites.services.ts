import { ObjectId } from 'mongodb'
import { Favorite } from '~/models/favourite.model'
import { FavoriteRqBody } from '~/types/requests/favourites'

class FavoriteService {
  async create(body: FavoriteRqBody) {
    const { user, article } = body
    const data = { user, article }
    const favorite = await Favorite.create(data)
    return favorite
  }

  async getByArticleIdAndUserId(userId: string, articleId: string) {
    return (
      (await Favorite.findOne(
        {
          article: new ObjectId(articleId),
          user: new ObjectId(userId)
        },
        '-created_at -updated-at'
      )) || null
    )
  }
}

const favoriteService = new FavoriteService()
export default favoriteService
