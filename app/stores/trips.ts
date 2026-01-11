import { defineStore } from 'pinia'
import type { TripList, TripDetail, PaginatedResponse, TripsListParams } from '~/types'

export const useTripsStore = defineStore('trips', () => {
  const { get } = useApi()

  // State
  const trips = ref<TripList[]>([])
  const currentTrip = ref<TripDetail | null>(null)
  const count = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedTrips = computed(() => {
    return [...trips.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasTrips = computed(() => trips.value.length > 0)

  const getTripBySlug = computed(() => (slug: string) => {
    return trips.value.find(trip => trip.slug === slug)
  })

  const tripsByCategory = computed(() => (categoryId: number) => {
    return trips.value.filter(trip => trip.category?.id === categoryId)
  })

  // Actions
  async function fetchTrips(params?: TripsListParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<TripList>>('/trips/', params)
      trips.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch trips'
      console.error('Error fetching trips:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchTripBySlug(slug: string) {
    loadingDetail.value = true
    error.value = null

    try {
      const response = await get<TripDetail>(`/trips/${slug}/`)
      currentTrip.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch trip details'
      console.error('Error fetching trip details:', e)
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  function clearCurrentTrip() {
    currentTrip.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    trips,
    currentTrip,
    count,
    loading,
    loadingDetail,
    error,
    // Getters
    sortedTrips,
    hasTrips,
    getTripBySlug,
    tripsByCategory,
    // Actions
    fetchTrips,
    fetchTripBySlug,
    clearCurrentTrip,
    clearError
  }
})
