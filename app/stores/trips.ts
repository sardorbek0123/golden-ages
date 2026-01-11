import { defineStore } from 'pinia'
import type { TripList, TripDetail, PaginatedResponse, TripsListParams } from '~/types'
import { API_BASE_URL } from '~/types'

interface TripsState {
  trips: TripList[]
  currentTrip: TripDetail | null
  count: number
  loading: boolean
  loadingDetail: boolean
  error: string | null
}

export const useTripsStore = defineStore('trips', {
  state: (): TripsState => ({
    trips: [],
    currentTrip: null,
    count: 0,
    loading: false,
    loadingDetail: false,
    error: null
  }),

  getters: {
    sortedTrips: (state) => {
      return [...state.trips].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    },
    hasTrips: (state) => state.trips.length > 0,
    getTripBySlug: (state) => (slug: string) => {
      return state.trips.find(trip => trip.slug === slug)
    },
    tripsByCategory: (state) => (categoryId: number) => {
      return state.trips.filter(trip => trip.category?.id === categoryId)
    }
  },

  actions: {
    async fetchTrips(params?: TripsListParams) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.category) query.set('category', params.category)
        if (params?.active) query.set('active', params.active)
        if (params?.price__gte) query.set('price__gte', params.price__gte)
        if (params?.price__lte) query.set('price__lte', params.price__lte)
        if (params?.price) query.set('price', params.price)
        if (params?.search) query.set('search', params.search)
        if (params?.ordering) query.set('ordering', params.ordering)
        if (params?.limit) query.set('limit', params.limit.toString())
        if (params?.offset) query.set('offset', params.offset.toString())

        const url = `${API_BASE_URL}/trips/${query.toString() ? `?${query.toString()}` : ''}`
        const response = await $fetch<PaginatedResponse<TripList>>(url)

        this.trips = response.results
        this.count = response.count
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch trips'
        console.error('Error fetching trips:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTripBySlug(slug: string) {
      this.loadingDetail = true
      this.error = null

      try {
        const url = `${API_BASE_URL}/trips/${slug}/`
        const response = await $fetch<TripDetail>(url)

        this.currentTrip = response
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch trip details'
        console.error('Error fetching trip details:', error)
        return null
      } finally {
        this.loadingDetail = false
      }
    },

    clearCurrentTrip() {
      this.currentTrip = null
    },

    clearError() {
      this.error = null
    }
  }
})

