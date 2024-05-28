import { ObjectId } from 'mongodb'
import { Category } from '~/models/category.model'
import { CreateCategoryReqBody } from '~/types/requests/categories'

class CategoryService {
  async create(body: CreateCategoryReqBody) {
    const category = await Category.create({ ...body })
    return category
  }

  async update(id: string, body: CreateCategoryReqBody) {
    const category = await Category.updateOne({ _id: new ObjectId(id) }, [{ $set: { ...body } }])
    return category
  }
}

const categoryService = new CategoryService()
export default categoryService
