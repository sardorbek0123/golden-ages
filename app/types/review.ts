/**
 * Review types for Golden Ages Travel API
 */

export interface ReviewCreate {
  rating: number // 1-5
  full_name: string
  role: string
  avatar?: string | null
  review: string
}

export interface ReviewList {
  id: number
  rating: number // 1-5
  full_name: string
  role: string
  avatar?: string | null
  review: string
  order?: number
  created_at: string
}

