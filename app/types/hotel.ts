export interface HotelCity {
  id: number
  name: string
  slug: string
  location: string
  image: string
}

export interface HotelCategory {
  id: number
  name: string
  icon: string | null
}

export interface HotelList {
  id: number
  city: HotelCity
  category: HotelCategory
  image: string
  name: string
  description: string
}

export interface HotelDetail extends HotelList {
  // Add any additional fields for detail view if needed
}

export interface HotelsListParams {
  city?: number
  category?: number
  search?: string
  limit?: number
  offset?: number
}
