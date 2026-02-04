import { defineStore } from 'pinia'
import type { UserMessageCreate } from '~/types'

export const useMessagesStore = defineStore('messages', () => {
  const { post } = useApi()

  // State
  const loading = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function createMessage(data: UserMessageCreate) {
    loading.value = true
    error.value = null
    success.value = false

    try {
      await post<UserMessageCreate>('/messages/create/', data as unknown as Record<string, unknown>)
      success.value = true
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
      console.error('Error creating message:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  function resetState() {
    loading.value = false
    success.value = false
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    loading,
    success,
    error,
    // Actions
    createMessage,
    resetState,
    clearError
  }
})
