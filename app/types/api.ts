/**
 * Base API types for Golden Ages Travel API
 */

// Paginated response wrapper
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Common query parameters for list endpoints
export interface PaginationParams {
  limit?: number
  offset?: number
  ordering?: string
}

// Search parameters
export interface SearchParams extends PaginationParams {
  search?: string
}

// API error response
export interface ApiError {
  detail?: string
  message?: string
  [key: string]: unknown
}

// API base URL
export const API_BASE_URL = 'https://api.goldenagestravel.com/api'

