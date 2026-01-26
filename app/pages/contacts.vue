<script setup lang="ts">
const { t } = useI18n()
const settingsStore = useSettingsStore()
const { settings, loading } = storeToRefs(settingsStore)

onMounted(async () => {
  if (!settings.value) {
    await settingsStore.fetchSettings()
  }
})

const formatPhoneForDisplay = (phone: string | undefined) => {
    return `+998${phone}` || ''
}

const formatPhoneForLink = (phone: string | undefined) => {
    return `+998${phone}` || ''
}

const getGoogleMapsUrl = () => {
  if (!settings.value?.address_lat || !settings.value?.address_long) return '#'
  return `https://www.google.com/maps?q=${settings.value.address_lat},${settings.value.address_long}`
}

const officeHoursLines = computed(() => {
  if (!settings.value?.office_hours) return []
  return settings.value.office_hours.split('\n').map(line => line.trim()).filter(Boolean)
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F0F0]">
    <!-- Hero Section -->
    <section class="pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-10 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6">
      <div class="container mx-auto">
        <!-- Title and Description -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-dark-normal max-w-xl leading-tight">
            {{ t('contacts.heroTitle') }}
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-grey-darker max-w-md lg:pt-4">
            {{ t('contacts.heroDescription') }}
          </p>
        </div>

        <!-- Contact Cards -->
        <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-orange-normal border-t-transparent" />
        </div>

        <div v-else class="bg-[#F9FAF9] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8">
            <!-- General Inquiries -->
            <div class="border-b sm:border-b-0 sm:border-r border-[#11111133] pb-6 sm:pb-0 sm:pr-4 md:pr-6">
              <h3 class="text-dark-normal font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                {{ t('contacts.generalInquiries') }}
              </h3>
              <div class="space-y-2.5 sm:space-y-3">
                <a
                  v-if="settings?.general_inquiry_email"
                  :href="`mailto:${settings.general_inquiry_email}`"
                  class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-xs sm:text-sm flex-1 break-all">{{ settings.general_inquiry_email }}</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
                <a
                  v-if="settings?.general_inquiry_number"
                  :href="`tel:${formatPhoneForLink(settings.general_inquiry_number)}`"
                  class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-xs sm:text-sm flex-1">{{ formatPhoneForDisplay(settings.general_inquiry_number) }}</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Technical Support -->
            <div class="border-b sm:border-b-0 sm:border-r border-[#11111133] pb-6 sm:pb-0 sm:pr-4 md:pr-6">
              <h3 class="text-dark-normal font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                {{ t('contacts.technicalSupport') }}
              </h3>
              <div class="space-y-2.5 sm:space-y-3">
                <a
                  v-if="settings?.technical_support_email"
                  :href="`mailto:${settings.technical_support_email}`"
                  class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-xs sm:text-sm flex-1 break-all">{{ settings.technical_support_email }}</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
                <a
                  v-if="settings?.technical_support_number"
                  :href="`tel:${formatPhoneForLink(settings.technical_support_number)}`"
                  class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-xs sm:text-sm flex-1">{{ formatPhoneForDisplay(settings.technical_support_number) }}</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Our Office -->
            <div class="border-b sm:border-b-0 sm:border-r border-[#11111133] pb-6 sm:pb-0 sm:pr-4 md:pr-6">
              <h3 class="text-dark-normal font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                {{ t('contacts.ourOffice') }}
              </h3>
              <div class="space-y-2.5 sm:space-y-3">
                <p v-if="settings?.address" class="text-grey-darker text-xs sm:text-sm leading-relaxed">
                  {{ settings.address }}
                </p>
                <a
                  :href="getGoogleMapsUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg sm:rounded-xl border border-grey-normal hover:border-orange-normal transition-colors"
                >
                  <span class="text-dark-normal text-xs sm:text-sm">{{ t('contacts.getDirections') }}</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Office Hours -->
            <div>
              <h3 class="text-dark-normal font-semibold text-base sm:text-lg mb-4 sm:mb-6">
                {{ t('contacts.officeHours') }}
              </h3>
              <div class="space-y-1.5 sm:space-y-2">
                <p
                  v-for="(line, index) in officeHoursLines"
                  :key="index"
                  class="text-grey-darker text-xs sm:text-sm"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <SectionContactForm id="form"/>
    <SectionFAQ />
  </div>
</template>
