/**
 * Trip types for Golden Ages Travel API
 */

import type { TripCategory } from './category'

export interface Utility {
  id: number
  name: string
  icon?: string
  order?: number
}

export interface TripPlan {
  id: number
  label?: string | null
  name: string
  description?: string | null
  order?: number
}

export interface TripImage {
  id: number
  image: string
  order?: number
}

export interface TripList {
  id: number
  name: string
  label?: string | null
  category?: TripCategory
  slug: string
  short_description: string
  locations: string
  price: number
  order?: number
  created_at: string
}

export interface TripDetail {
  id: number
  active?: boolean
  name: string
  label?: string | null
  category?: TripCategory
  slug: string
  short_description: string
  description: string
  locations: string
  utilities: Utility[]
  video?: string | null
  price: number
  order?: number
  tripplan_set: TripPlan[]
  tripimage_set: TripImage[]
  created_at: string
  updated_at: string
}

// Query parameters for trips list endpoint
export interface TripsListParams {
  category?: string
  active?: string
  price__gte?: string
  price__lte?: string
  price?: string
  search?: string
  ordering?: string
  limit?: number
  offset?: number
}

