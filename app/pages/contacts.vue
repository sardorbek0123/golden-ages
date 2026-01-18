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
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-4 container mx-auto">
      <div class="container mx-auto">
        <!-- Title and Description -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12 md:mb-16">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-normal max-w-xl leading-tight">
            {{ t('contacts.heroTitle') }}
          </h1>
          <p class="text-grey-darker text-lg max-w-md lg:pt-4">
            {{ t('contacts.heroDescription') }}
          </p>
        </div>

        <!-- Contact Cards -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-normal border-t-transparent" />
        </div>

        <div v-else class="bg-[#F9FAF9] rounded-2xl p-6 md:p-10">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <!-- General Inquiries -->
            <div class="border-r border-[#11111133] pr-6">
              <h3 class="text-dark-normal font-semibold text-lg mb-6">
                {{ t('contacts.generalInquiries') }}
              </h3>
              <div class="space-y-3">
                <a
                  v-if="settings?.general_inquiry_email"
                  :href="`mailto:${settings.general_inquiry_email}`"
                  class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-sm">{{ settings.general_inquiry_email }}</span>
                  <svg class="w-4 h-4 text-orange-normal ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
                <a
                  v-if="settings?.general_inquiry_number"
                  :href="`tel:${formatPhoneForLink(settings.general_inquiry_number)}`"
                  class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-sm">{{ formatPhoneForDisplay(settings.general_inquiry_number) }}</span>
                  <svg class="w-4 h-4 text-orange-normal ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Technical Support -->
            <div class="border-r border-[#11111133] pr-6">
              <h3 class="text-dark-normal font-semibold text-lg mb-6">
                {{ t('contacts.technicalSupport') }}
              </h3>
              <div class="space-y-3">
                <a
                  v-if="settings?.technical_support_email"
                  :href="`mailto:${settings.technical_support_email}`"
                  class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-sm">{{ settings.technical_support_email }}</span>
                  <svg class="w-4 h-4 text-orange-normal ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
                <a
                  v-if="settings?.technical_support_number"
                  :href="`tel:${formatPhoneForLink(settings.technical_support_number)}`"
                  class="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-grey-normal hover:border-orange-normal transition-colors group"
                >
                  <span class="text-dark-normal text-sm">{{ formatPhoneForDisplay(settings.technical_support_number) }}</span>
                  <svg class="w-4 h-4 text-orange-normal ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Our Office -->
            <div class="border-r border-[#11111133] pr-6">
              <h3 class="text-dark-normal font-semibold text-lg mb-6">
                {{ t('contacts.ourOffice') }}
              </h3>
              <div class="space-y-3">
                <p v-if="settings?.address" class="text-grey-darker text-sm leading-relaxed">
                  {{ settings.address }}
                </p>
                <a
                  :href="getGoogleMapsUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-grey-normal hover:border-orange-normal transition-colors"
                >
                  <span class="text-dark-normal text-sm">{{ t('contacts.getDirections') }}</span>
                  <svg class="w-4 h-4 text-orange-normal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Office Hours -->
            <div>
              <h3 class="text-dark-normal font-semibold text-lg mb-6">
                {{ t('contacts.officeHours') }}
              </h3>
              <div class="space-y-2">
                <p
                  v-for="(line, index) in officeHoursLines"
                  :key="index"
                  class="text-grey-darker text-sm"
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
