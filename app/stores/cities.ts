import { defineStore } from 'pinia'
import type { CityList, CityDetail, PaginatedResponse, SearchParams } from '~/types'

export const useCitiesStore = defineStore('cities', () => {
  const { get } = useApi()

  // State
  const cities = ref<CityList[]>([])
  const currentCity = ref<CityDetail | null>(null)
  const count = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedCities = computed(() => {
    console.log(cities.value)
    return [...cities.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasCities = computed(() => cities.value.length > 0)

  const getCityBySlug = computed(() => (slug: string) => {
    return cities.value.find(city => city.slug === slug)
  })

  // Actions
  async function fetchCities(params?: SearchParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<CityList>>('/cities/', params)
      cities.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch cities'
      console.error('Error fetching cities:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchCityBySlug(slug: string) {
    loadingDetail.value = true
    error.value = null

    try {
      const response = await get<CityDetail>(`/cities/${slug}/`)
      currentCity.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch city details'
      console.error('Error fetching city details:', e)
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  function clearCurrentCity() {
    currentCity.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    cities,
    currentCity,
    count,
    loading,
    loadingDetail,
    error,
    // Getters
    sortedCities,
    hasCities,
    getCityBySlug,
    // Actions
    fetchCities,
    fetchCityBySlug,
    clearCurrentCity,
    clearError
  }
})
