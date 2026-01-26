<script setup lang="ts">
import type { TripDetail } from '~/types/trip'

interface Props {
  trip: TripDetail
}

const props = defineProps<Props>()
const { t } = useI18n()

// Get currency symbol based on currency key
const getCurrencyLabel = (currencyKey?: string | null): string => {
  switch (currencyKey) {
    case 'sum':
      return 'UZS'
    case 'dollar':
      return 'USD'
    case 'euro':
      return 'EUR'
    default:
      return 'USD'
  }
}

// Format price with currency
const formattedPrice = computed(() => {
  const currencyLabel = getCurrencyLabel(props.trip.currency?.key)
  return new Intl.NumberFormat('uz-UZ').format(props.trip.price) + ' ' + currencyLabel
})

// Get sorted utilities
const sortedUtilities = computed(() => {
  if (!props.trip.trip_utilities?.length) return []
  return [...props.trip.trip_utilities].sort((a, b) => (a.utility.order ?? 0) - (b.utility.order ?? 0))
})
</script>

<template>
  <section class="py-8 sm:py-10 md:py-12">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        <!-- Left Column - Tour Info Card -->
        <div class="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-[#9195923D]">
          <!-- Category Badge -->
          <CommonBadge :text="trip.category?.name || ''" />

          <!-- Title -->
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 mt-3 sm:mt-0">
            {{ trip.label || trip.name }}
          </h2>

          <!-- Short Description -->
          <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {{ trip.short_description }}
          </p>

          <!-- Details Grid -->
          <div 
            v-if="sortedUtilities.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-[#FFF6E64D] border border-[#9195923D] rounded-xl sm:rounded-2xl py-4 sm:py-5 md:py-6 px-4 sm:px-5"
          >
            <div 
              v-for="(tripUtility, index) in sortedUtilities" 
              :key="tripUtility.id"
              class="flex items-start gap-2 sm:gap-3"
              :class="{ 
                'border-b sm:border-b-0 sm:border-r border-[#DBDBDB] pb-3 sm:pb-0 sm:pr-3 sm:pr-4': index < sortedUtilities.length - 1 && (sortedUtilities.length > 3 || index < 2),
                'lg:border-r': (index + 1) % 3 !== 0 && index !== sortedUtilities.length - 1 && sortedUtilities.length > 3
              }"
            >
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-start justify-center shrink-0">
                <img 
                  v-if="tripUtility.utility.icon"
                  :src="tripUtility.utility.icon" 
                  :alt="tripUtility.utility.name"
                  class="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ tripUtility.utility.name }}</p>
                <p class="text-xs sm:text-sm font-medium text-gray-900">{{ tripUtility.value }}</p>
              </div>
            </div>
          </div>

          <!-- Price & Book Button -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-400">{{ t('tourDetail.price') }}</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900">{{ formattedPrice }} <span class="text-xs sm:text-sm font-normal text-gray-500">{{ t('tourDetail.perPerson') }}</span></p>
            </div>
            <NuxtLink to="#form" class="w-full sm:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-normal text-white text-sm sm:text-base font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
              {{ t('tourDetail.bookNow') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column - Description -->
        <div>
          <!-- Description Badge -->
          <CommonBadge :text="t('tourDetail.description')" />

          <!-- Description Text -->
          <div class="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-600 leading-relaxed mt-3 sm:mt-0" v-html="trip.description" />
        </div>
      </div>
    </div>
  </section>
</template>

