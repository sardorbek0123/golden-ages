import type { FetchOptions } from 'ofetch'
import { API_BASE_URL } from '~/types'

/**
 * Helper to get current locale at request time
 * This ensures we always use the fresh locale value, not a stale SSR reference
 */
function getCurrentLocale(): string {
  try {
    const { locale } = useI18n()
    
    return locale.value
  } catch {
    return 'en' // fallback
  }
}

/**
 * Composable for making API requests with automatic language header
 * Automatically adds Accept-Language header based on current locale
 */
export function useApi() {
  /**
   * Make a GET request to the API
   */
  async function get<T>(endpoint: string, params?: Record<string, unknown>) {
    const query = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.set(key, String(value))
        }
      })
    }

    const currentLocale = getCurrentLocale()
    const url = `${API_BASE_URL}${endpoint}${query.toString() ? `?${query.toString()}` : ''}`
    return $fetch<T>(url, {
      method: 'GET',
      headers: {
        'Accept-Language': currentLocale
      }
    })
  }

  /**
   * Make a POST request to the API
   */
  async function post<T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<FetchOptions, 'method' | 'body'>) {
    const url = `${API_BASE_URL}${endpoint}`
    const currentLocale = getCurrentLocale()

    return $fetch<T>(url, {
      ...options,
      method: 'POST',
      body,
      headers: {
        'Accept-Language': currentLocale,
        ...options?.headers
      }
    })
  }

  /**
   * Make a PUT request to the API
   */
  async function put<T>(endpoint: string, body?: Record<string, unknown>, options?: Omit<FetchOptions, 'method' | 'body'>) {
    const url = `${API_BASE_URL}${endpoint}`
    const currentLocale = getCurrentLocale()

    return $fetch<T>(url, {
      ...options,
      method: 'PUT',
      body,
      headers: {
        'Accept-Language': currentLocale,
        ...options?.headers
      }
    })
  }

  /**
   * Make a DELETE request to the API
   */
  async function del<T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) {
    const url = `${API_BASE_URL}${endpoint}`
    const currentLocale = getCurrentLocale()

    return $fetch<T>(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Accept-Language': currentLocale,
        ...options?.headers
      }
    })
  }

  return {
    get,
    post,
    put,
    del
  }
}

