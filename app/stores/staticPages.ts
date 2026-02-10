import { defineStore } from 'pinia'

export const useStaticPagesStore = defineStore('staticPages', () => {
  const { get } = useApi()

  // State
  const page = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters

  // Actions
  async function fetchPage(slug: string) {
    loading.value = true
    error.value = null

    try {
      const response = await get(`/static-page/${slug}/`)
      page.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch static page'
      console.error('Error fetching static page:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    page,
    loading,
    error,
    // Actions
    fetchPage,
    clearError
  }
})
