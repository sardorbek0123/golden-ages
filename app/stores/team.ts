import { defineStore } from 'pinia'
import type { TeamMember, PaginatedResponse, PaginationParams } from '~/types'
import { API_BASE_URL } from '~/types'

interface TeamState {
  members: TeamMember[]
  count: number
  loading: boolean
  error: string | null
}

export const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    members: [],
    count: 0,
    loading: false,
    error: null
  }),

  getters: {
    sortedMembers: (state) => {
      return [...state.members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    },
    hasMembers: (state) => state.members.length > 0
  },

  actions: {
    async fetchTeamMembers(params?: PaginationParams) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.limit) query.set('limit', params.limit.toString())
        if (params?.offset) query.set('offset', params.offset.toString())
        if (params?.ordering) query.set('ordering', params.ordering)

        const url = `${API_BASE_URL}/team/${query.toString() ? `?${query.toString()}` : ''}`
        const response = await $fetch<PaginatedResponse<TeamMember>>(url)

        this.members = response.results
        this.count = response.count
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch team members'
        console.error('Error fetching team members:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

