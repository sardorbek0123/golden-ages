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
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 gap-12">
        <!-- Left Column - Tour Info Card -->
        <div class="bg-white rounded-2xl p-8 border border-[#9195923D]">
          <!-- Category Badge -->
          <CommonBadge :text="trip.category?.name || ''" />

          <!-- Title -->
          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            {{ trip.label || trip.name }}
          </h2>

          <!-- Short Description -->
          <p class="text-gray-600 mb-6">
            {{ trip.short_description }}
          </p>

          <!-- Details Grid -->
          <div 
            v-if="sortedUtilities.length"
            class="grid grid-cols-3 gap-4 mb-6 bg-[#FFF6E64D] border border-[#9195923D] rounded-2xl py-6 px-5"
          >
            <div 
              v-for="(tripUtility, index) in sortedUtilities" 
              :key="tripUtility.id"
              class="flex items-start gap-3"
              :class="{ 'border-r border-[#DBDBDB]': (index + 1) % 3 !== 0 && index !== sortedUtilities.length - 1 }"
            >
              <div class="w-10 h-10 rounded-lg flex items-start justify-center shrink-0">
                <img 
                  v-if="tripUtility.utility.icon"
                  :src="tripUtility.utility.icon" 
                  :alt="tripUtility.utility.name"
                  class="w-8 h-8 object-contain"
                />
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#6B7280" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">{{ tripUtility.utility.name }}</p>
                <p class="text-sm font-medium text-gray-900">{{ tripUtility.value }}</p>
              </div>
            </div>
          </div>

          <!-- Price & Book Button -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-400">{{ t('tourDetail.price') }}</p>
              <p class="text-xl font-bold text-gray-900">{{ formattedPrice }} <span class="text-sm font-normal text-gray-500">{{ t('tourDetail.perPerson') }}</span></p>
            </div>
            <NuxtLink to="#form" class="px-8 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
              {{ t('tourDetail.bookNow') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column - Description -->
        <div>
          <!-- Description Badge -->
          <CommonBadge :text="t('tourDetail.description')" />

          <!-- Description Text -->
          <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed" v-html="trip.description" />
        </div>
      </div>
    </div>
  </section>
</template>

