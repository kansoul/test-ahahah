export interface CreateArticleReqBody {
  title: string
  content: string
  address: string
  anticipated_price: number | null
  banners: string[]
  categories: string[]
  author: string
  province: string
  district: string
  ward: string
}

export interface CreateAppointmentReqBody {
  title: string
  planned_date: Date
  anticipated_price?: string
  participants: {
    email: string
  }[]
  location: {
    province: string
    district: string
    ward: string
    address: string
  }
  is_public: string
  status?: boolean
  notes: string
  feedback?: string[]
}
