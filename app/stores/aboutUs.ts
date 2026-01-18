import { defineStore } from 'pinia'
import type { AboutUsItem, PaginatedResponse, PaginationParams } from '~/types'

export const useAboutUsStore = defineStore('aboutUs', () => {
  const { get } = useApi()

  // State
  const items = ref<AboutUsItem[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasItems = computed(() => items.value.length > 0)

  // Actions
  async function fetchAboutUs(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<AboutUsItem>>('/about-us/', params)
      items.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch about us data'
      console.error('Error fetching about us:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    items,
    count,
    loading,
    error,
    // Getters
    hasItems,
    // Actions
    fetchAboutUs,
    clearError
  }
})
