/**
 * City types for Golden Ages Travel API
 */

export interface CityImage {
  id: number
  image: string
  order?: number
}

export interface CityList {
  id: number
  name: string
  slug: string
  location: string
  image?: string
  order?: number
}

export interface CityProperty {
  id: number
  value: string
  property: {
    id: number
    name: string
  }
}

export interface CityExperienceHighlight {
  id: number
  icon: string
  title: string
  description: string
}

export interface CityDetail {
  id: number
  active?: boolean
  name: string
  title?: string
  subtitle?: string
  slug: string
  location: string
  image?: string
  order?: number
  cityimage_set: CityImage[]
  properties?: CityProperty[]
  region?: string
  population?: string
  founded?: string
  unesco_status?: string
  best_season?: string
  experience_highlights?: CityExperienceHighlight[]
  created_at: string
  updated_at: string
  description?: string
}

export interface FamousPlaceImage {
  id: number
  image: string
}

export interface FamousPlace {
  id: number
  name: string
  images: FamousPlaceImage[]
  description: string
}

