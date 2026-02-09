export interface Blog {
  id: number
  slug: string
  image?: string
  name: string
  description: string
  category?: BlogCategory
  is_new?: boolean
  created_at?: string
}

export interface BlogCategory {
  id: number
  name: string
  slug?: string
}