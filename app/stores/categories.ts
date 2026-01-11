import { defineStore } from 'pinia'
import type { TripCategory, PaginatedResponse, PaginationParams } from '~/types'
import { API_BASE_URL } from '~/types'

interface CategoriesState {
  categories: TripCategory[]
  count: number
  loading: boolean
  error: string | null
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    count: 0,
    loading: false,
    error: null
  }),

  getters: {
    sortedCategories: (state) => {
      return [...state.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    },
    hasCategories: (state) => state.categories.length > 0
  },

  actions: {
    async fetchCategories(params?: PaginationParams) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.limit) query.set('limit', params.limit.toString())
        if (params?.offset) query.set('offset', params.offset.toString())
        if (params?.ordering) query.set('ordering', params.ordering)

        const url = `${API_BASE_URL}/categories/${query.toString() ? `?${query.toString()}` : ''}`
        const response = await $fetch<PaginatedResponse<TripCategory>>(url)

        this.categories = response.results
        this.count = response.count
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch categories'
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

