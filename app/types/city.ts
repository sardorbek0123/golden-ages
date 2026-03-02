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

export interface CityDetail {
  id: number
  active?: boolean
  name: string
  slug: string
  location: string
  image?: string
  order?: number
  cityimage_set: CityImage[]
  created_at: string
  updated_at: string
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

