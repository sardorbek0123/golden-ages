import { defineStore } from 'pinia'
import type { SiteSettings } from '~/types'
import { API_BASE_URL } from '~/types'

interface SettingsState {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    settings: null,
    loading: false,
    error: null
  }),

  getters: {
    hasSocialLinks: (state) => {
      if (!state.settings) return false
      return !!(
        state.settings.facebook ||
        state.settings.linkedin ||
        state.settings.instagram ||
        state.settings.twitter
      )
    },
    socialLinks: (state) => {
      if (!state.settings) return []
      const links = []
      if (state.settings.facebook) links.push({ name: 'facebook', url: state.settings.facebook })
      if (state.settings.linkedin) links.push({ name: 'linkedin', url: state.settings.linkedin })
      if (state.settings.instagram) links.push({ name: 'instagram', url: state.settings.instagram })
      if (state.settings.twitter) links.push({ name: 'twitter', url: state.settings.twitter })
      return links
    }
  },

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null

      try {
        const url = `${API_BASE_URL}/settings/`
        const response = await $fetch<SiteSettings>(url)

        this.settings = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch settings'
        console.error('Error fetching settings:', error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

