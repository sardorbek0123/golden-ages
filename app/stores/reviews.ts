import { defineStore } from 'pinia'
import type { ReviewList, ReviewCreate, PaginatedResponse, PaginationParams } from '~/types'

export const useReviewsStore = defineStore('reviews', () => {
  const { get, post } = useApi()

  // State
  const reviews = ref<ReviewList[]>([])
  const count = ref(0)
  const loading = ref(false)
  const submitting = ref(false)
  const submitSuccess = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedReviews = computed(() => {
    return [...reviews.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasReviews = computed(() => reviews.value.length > 0)

  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
    return sum / reviews.value.length
  })

  // Actions
  async function fetchHomeReviews(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<ReviewList>>('/reviews/home/', params)
      reviews.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch reviews'
      console.error('Error fetching reviews:', e)
    } finally {
      loading.value = false
    }
  }

  async function createReview(data: ReviewCreate) {
    submitting.value = true
    error.value = null
    submitSuccess.value = false

    try {
      await post<ReviewCreate>('/reviews/create/', data)
      submitSuccess.value = true
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create review'
      console.error('Error creating review:', e)
      return false
    } finally {
      submitting.value = false
    }
  }

  function resetSubmitState() {
    submitting.value = false
    submitSuccess.value = false
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    reviews,
    count,
    loading,
    submitting,
    submitSuccess,
    error,
    // Getters
    sortedReviews,
    hasReviews,
    averageRating,
    // Actions
    fetchHomeReviews,
    createReview,
    resetSubmitState,
    clearError
  }
})
