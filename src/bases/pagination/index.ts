import { Request } from 'express'
import mongoose from 'mongoose'
import { DEFAULT_LIMIT, DEFAULT_PAGE, SORT_DIRECTION } from '~/constants'

export const pagination = async <T extends object = object>(
  req: Request,
  model: mongoose.Model<T>,
  select = '',
  query?: any,
  populate?: any
) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_PAGE
  const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_LIMIT

  const startIndex = limit * (page - 1)
  const endIndex = page * limit

  const totalCount = await model.countDocuments(query)
  const totalPages = Math.ceil(totalCount / limit)

  const results: any = {
    pagination: {
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit
    }
  }

  if (endIndex < totalCount) {
    results.pagination.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.pagination.previous = {
      page: page > totalPages ? totalPages : page - 1,
      limit: limit
    }
  }

  const sortField = (req.query.sort as string) || 'created_at'
  const sortOrder = (req.query.orderBy as string) || SORT_DIRECTION.DESC

  const sort: { [key: string]: any } = {}
  sort[sortField] = sortOrder === 'asc' ? 1 : -1

  let queryBuilder = model.find(query).select(select).sort(sort).limit(limit).skip(startIndex)

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((pop) => {
        queryBuilder = queryBuilder.populate(pop)
      })
    } else {
      queryBuilder = queryBuilder.populate(populate)
    }
  }

  results.data = await queryBuilder.exec()

  return results
}
