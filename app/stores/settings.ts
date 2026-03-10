import { defineStore } from 'pinia'
import type { SiteSettings } from '~/types'

export const useSettingsStore = defineStore('settings', () => {
  const { get } = useApi()

  // State
  const settings = ref<SiteSettings | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasSocialLinks = computed(() => {
    if (!settings.value) return false
    return !!(
      settings.value.facebook ||
      settings.value.linkedin ||
      settings.value.instagram ||
      settings.value.twitter ||
      settings.value.telegram ||
      settings.value.whatsapp
    )
  })

  const socialLinks = computed(() => {
    if (!settings.value) return []
    const links = []
    if (settings.value.facebook) links.push({ name: 'facebook', url: settings.value.facebook })
    if (settings.value.linkedin) links.push({ name: 'linkedin', url: settings.value.linkedin })
    if (settings.value.instagram) links.push({ name: 'instagram', url: settings.value.instagram })
    if (settings.value.twitter) links.push({ name: 'twitter', url: settings.value.twitter })
    if (settings.value.telegram) links.push({ name: 'telegram', url: settings.value.telegram })
    if (settings.value.whatsapp) links.push({ name: 'whatsapp', url: settings.value.whatsapp })
    return links
  })

  // Actions
  async function fetchSettings() {
    loading.value = true
    error.value = null

    try {
      const response = await get<SiteSettings>('/settings/')
      settings.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch settings'
      console.error('Error fetching settings:', e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    settings,
    loading,
    error,
    // Getters
    hasSocialLinks,
    socialLinks,
    // Actions
    fetchSettings,
    clearError
  }
})
