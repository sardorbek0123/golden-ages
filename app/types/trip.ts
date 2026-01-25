/**
 * Trip types for Golden Ages Travel API
 */

import type { TripCategory } from './category'

export interface TripCurrency {
  id: number
  key: 'sum' | 'dollar' | 'euro'
}

export interface TripPrice {
  date_from: string
  date_to: string
  price: number
  currency: TripCurrency | null
  available: boolean
}

export interface Utility {
  id: number
  name: string
  icon?: string
  order?: number
}

export interface TripUtility {
  id: number
  utility: Utility
  value: string
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
  currency?: TripCurrency | null
  order?: number
  images: TripImage[]
  trip_utilities?: TripUtility[]
  days_count?: number | null
  nights_count?: number | null
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
  trip_utilities: TripUtility[]
  video?: string | null
  price: number
  currency?: TripCurrency | null
  order?: number
  plans: TripPlan[]
  prices?: TripPrice[]
  images: TripImage[]
  days_count?: number | null
  nights_count?: number | null
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

