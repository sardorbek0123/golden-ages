import { defineStore } from 'pinia'
import type { TripCategory, PaginatedResponse, PaginationParams } from '~/types'

export const useCategoriesStore = defineStore('categories', () => {
  const { get } = useApi()

  // State
  const categories = ref<TripCategory[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedCategories = computed(() => {
    return [...categories.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasCategories = computed(() => categories.value.length > 0)

  // Actions
  async function fetchCategories(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<TripCategory>>('/categories/', params)
      categories.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch categories'
      console.error('Error fetching categories:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    categories,
    count,
    loading,
    error,
    // Getters
    sortedCategories,
    hasCategories,
    // Actions
    fetchCategories,
    clearError
  }
})
