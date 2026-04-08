import { defineStore } from 'pinia'
import type { UserMessageCreate, UserMessageLead } from '~/types'

export const useMessagesStore = defineStore('messages', () => {
  const { post } = useApi()

  // State
  const loading = ref(false)
  const leadLoading = ref(false)
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

  async function createLeadMessage(data: UserMessageLead) {
    leadLoading.value = true
    error.value = null

    try {
      await post('/messages/create/', data as unknown as Record<string, unknown>)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
      console.error('Error creating lead message:', e)
      return false
    } finally {
      leadLoading.value = false
    }
  }

  function resetState() {
    loading.value = false
    leadLoading.value = false
    success.value = false
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    loading,
    leadLoading,
    success,
    error,
    // Actions
    createMessage,
    createLeadMessage,
    resetState,
    clearError
  }
})
