import { defineStore } from 'pinia'
import type { CityList, CityDetail, PaginatedResponse, SearchParams } from '~/types'
import { API_BASE_URL } from '~/types'

interface CitiesState {
  cities: CityList[]
  currentCity: CityDetail | null
  count: number
  loading: boolean
  loadingDetail: boolean
  error: string | null
}

export const useCitiesStore = defineStore('cities', {
  state: (): CitiesState => ({
    cities: [],
    currentCity: null,
    count: 0,
    loading: false,
    loadingDetail: false,
    error: null
  }),

  getters: {
    sortedCities: (state) => {
      return [...state.cities].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    },
    hasCities: (state) => state.cities.length > 0,
    getCityBySlug: (state) => (slug: string) => {
      return state.cities.find(city => city.slug === slug)
    }
  },

  actions: {
    async fetchCities(params?: SearchParams) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.search) query.set('search', params.search)
        if (params?.limit) query.set('limit', params.limit.toString())
        if (params?.offset) query.set('offset', params.offset.toString())
        if (params?.ordering) query.set('ordering', params.ordering)

        const url = `${API_BASE_URL}/cities/${query.toString() ? `?${query.toString()}` : ''}`
        const response = await $fetch<PaginatedResponse<CityList>>(url)

        this.cities = response.results
        this.count = response.count
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch cities'
        console.error('Error fetching cities:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCityBySlug(slug: string) {
      this.loadingDetail = true
      this.error = null

      try {
        const url = `${API_BASE_URL}/cities/${slug}/`
        const response = await $fetch<CityDetail>(url)

        this.currentCity = response
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch city details'
        console.error('Error fetching city details:', error)
        return null
      } finally {
        this.loadingDetail = false
      }
    },

    clearCurrentCity() {
      this.currentCity = null
    },

    clearError() {
      this.error = null
    }
  }
})

