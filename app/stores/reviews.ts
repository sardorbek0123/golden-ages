import { defineStore } from 'pinia'
import type { ReviewList, ReviewCreate, PaginatedResponse, PaginationParams } from '~/types'
import { API_BASE_URL } from '~/types'

interface ReviewsState {
  reviews: ReviewList[]
  count: number
  loading: boolean
  submitting: boolean
  submitSuccess: boolean
  error: string | null
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    count: 0,
    loading: false,
    submitting: false,
    submitSuccess: false,
    error: null
  }),

  getters: {
    sortedReviews: (state) => {
      return [...state.reviews].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    },
    hasReviews: (state) => state.reviews.length > 0,
    averageRating: (state) => {
      if (state.reviews.length === 0) return 0
      const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0)
      return sum / state.reviews.length
    }
  },

  actions: {
    async fetchHomeReviews(params?: PaginationParams) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.limit) query.set('limit', params.limit.toString())
        if (params?.offset) query.set('offset', params.offset.toString())
        if (params?.ordering) query.set('ordering', params.ordering)

        const url = `${API_BASE_URL}/reviews/home/${query.toString() ? `?${query.toString()}` : ''}`
        const response = await $fetch<PaginatedResponse<ReviewList>>(url)

        this.reviews = response.results
        this.count = response.count
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch reviews'
        console.error('Error fetching reviews:', error)
      } finally {
        this.loading = false
      }
    },

    async createReview(data: ReviewCreate) {
      this.submitting = true
      this.error = null
      this.submitSuccess = false

      try {
        const url = `${API_BASE_URL}/reviews/create/`
        await $fetch<ReviewCreate>(url, {
          method: 'POST',
          body: data
        })

        this.submitSuccess = true
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create review'
        console.error('Error creating review:', error)
        return false
      } finally {
        this.submitting = false
      }
    },

    resetSubmitState() {
      this.submitting = false
      this.submitSuccess = false
      this.error = null
    },

    clearError() {
      this.error = null
    }
  }
})

