import { defineStore } from 'pinia'
import type { FAQ, PaginatedResponse, PaginationParams } from '~/types'

export const useFaqsStore = defineStore('faqs', () => {
  const { get } = useApi()

  // State
  const faqs = ref<FAQ[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasFaqs = computed(() => faqs.value.length > 0)

  // Actions
  async function fetchFaqs(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<FAQ>>('/faqs/', params)
      faqs.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch FAQs'
      console.error('Error fetching FAQs:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    faqs,
    count,
    loading,
    error,
    // Getters
    hasFaqs,
    // Actions
    fetchFaqs,
    clearError
  }
})
