import { defineStore } from 'pinia'
import type { UserMessageCreate } from '~/types'
import { API_BASE_URL } from '~/types'

interface MessagesState {
  loading: boolean
  success: boolean
  error: string | null
}

export const useMessagesStore = defineStore('messages', {
  state: (): MessagesState => ({
    loading: false,
    success: false,
    error: null
  }),

  actions: {
    async createMessage(data: UserMessageCreate) {
      this.loading = true
      this.error = null
      this.success = false

      try {
        const url = `${API_BASE_URL}/messages/create/`
        await $fetch<UserMessageCreate>(url, {
          method: 'POST',
          body: data
        })

        this.success = true
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to send message'
        console.error('Error creating message:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    resetState() {
      this.loading = false
      this.success = false
      this.error = null
    },

    clearError() {
      this.error = null
    }
  }
})

