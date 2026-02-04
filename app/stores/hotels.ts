import { defineStore } from 'pinia'
import type { HotelList, HotelDetail, HotelsListParams } from '~/types/hotel'
import type { PaginatedResponse } from '~/types'

export const useHotelsStore = defineStore('hotels', () => {
  const { get } = useApi()

  // State
  const hotels = ref<HotelList[]>([])
  const currentHotel = ref<HotelDetail | null>(null)
  const count = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasHotels = computed(() => hotels.value.length > 0)

  const getHotelById = computed(() => (id: number) => {
    return hotels.value.find(hotel => hotel.id === id)
  })

  const hotelsByCity = computed(() => (cityId: number) => {
    return hotels.value.filter(hotel => hotel.city.id === cityId)
  })

  const hotelsByCategory = computed(() => (categoryId: number) => {
    return hotels.value.filter(hotel => hotel.category.id === categoryId)
  })

  // Actions
  async function fetchHotels(params?: HotelsListParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<HotelList>>('/hotels/', params as Record<string, unknown>)
      hotels.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch hotels'
      console.error('Error fetching hotels:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchHotelById(id: number) {
    loadingDetail.value = true
    error.value = null

    try {
      const response = await get<HotelDetail>(`/hotels/${id}/`)
      currentHotel.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch hotel details'
      console.error('Error fetching hotel details:', e)
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  async function fetchHotelsByCity(cityId: number) {
    return fetchHotels({ city: cityId })
  }

  async function fetchHotelsByCategory(categoryId: number) {
    return fetchHotels({ category: categoryId })
  }

  function clearCurrentHotel() {
    currentHotel.value = null
  }

  function clearError() {
    error.value = null
  }

  function $reset() {
    hotels.value = []
    currentHotel.value = null
    count.value = 0
    loading.value = false
    loadingDetail.value = false
    error.value = null
  }

  return {
    // State
    hotels,
    currentHotel,
    count,
    loading,
    loadingDetail,
    error,
    // Getters
    hasHotels,
    getHotelById,
    hotelsByCity,
    hotelsByCategory,
    // Actions
    fetchHotels,
    fetchHotelById,
    fetchHotelsByCity,
    fetchHotelsByCategory,
    clearCurrentHotel,
    clearError,
    $reset
  }
})
