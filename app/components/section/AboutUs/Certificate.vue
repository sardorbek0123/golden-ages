<script setup lang="ts">
import licenseImage from '~/assets/images/lisence.png'

const { t } = useI18n()

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

// Fetch settings if not already loaded
onMounted(async () => {
  if (!settings.value) {
    await settingsStore.fetchSettings()
  }
})

const certificateUrl = computed(() => settings.value?.certificate || null)

const downloadCertificate = () => {
  if (certificateUrl.value) {
    window.open(certificateUrl.value, '_blank')
  }
}
</script>

<template>
  <section v-if="certificateUrl" class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto">
      <div class="relative bg-linear-to-br from-orange-normal to-orange-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 overflow-hidden">
        <!-- Decorative background element -->
        <div class="absolute -right-12 -top-1/12 w-1/3 pointer-events-none hidden md:block">
          <img
            :src="licenseImage"
            alt="Certificate"
            class="object-cover rounded-full"
            loading="lazy"
          >
        </div>

        <div class="relative z-10 max-w-3xl">
          <!-- Badge -->
          <span class="inline-flex px-3 py-1 border border-white/50 text-white text-xs font-medium uppercase tracking-wide rounded-full mb-4 sm:mb-6">
            {{ t('license.badge') }}
          </span>

          <!-- Title/Description -->
          <p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-snug italic mb-8 sm:mb-10 md:mb-12">
            {{ t('license.description') }}
          </p>

          <!-- Download Button -->
          <button
            @click="downloadCertificate"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-dark-normal font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
          >
            <Icon name="lucide:download" class="w-4 h-4 sm:w-5 sm:h-5" />
            {{ t('license.download') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
