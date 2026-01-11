import { defineStore } from 'pinia'
import type { TeamMember, PaginatedResponse, PaginationParams } from '~/types'

export const useTeamStore = defineStore('team', () => {
  const { get } = useApi()

  // State
  const members = ref<TeamMember[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedMembers = computed(() => {
    return [...members.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasMembers = computed(() => members.value.length > 0)

  // Actions
  async function fetchTeamMembers(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<TeamMember>>('/team/', params)
      members.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch team members'
      console.error('Error fetching team members:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    members,
    count,
    loading,
    error,
    // Getters
    sortedMembers,
    hasMembers,
    // Actions
    fetchTeamMembers,
    clearError
  }
})
