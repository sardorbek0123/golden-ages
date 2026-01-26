<script setup lang="ts">
import type { TripDetail } from '~/types/trip'

interface Props {
  trip: TripDetail
}

const props = defineProps<Props>()
const { t } = useI18n()

// Get main image
const mainImage = computed(() => {
  if (!props.trip.images?.length) return ''
  const sorted = [...props.trip.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted[0]?.image || ''
})

// Get secondary images
const secondaryImages = computed(() => {
  if (!props.trip.images?.length) return []
  const sorted = [...props.trip.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted.slice(1, 3)
})

// Go back
const goBack = () => {
  navigateTo('/tours')
}
</script>

<template>
  <section class="pt-6 sm:pt-8 md:pt-12">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Back Button -->
      <button 
        class="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors mt-12 sm:mt-14 md:mt-16 mb-4 sm:mb-6"
        @click="goBack"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ t('tourDetail.back') }}</span>
      </button>

      <!-- Title -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
        {{ trip.name }}
      </h1>

      <!-- Locations -->
      <div class="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ trip.locations }}</span>
      </div>

      <!-- Image Gallery -->
      <div>
        <!-- Single image layout -->
        <div v-if="trip.images?.length === 1" class="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
          <img 
            :src="mainImage" 
            :alt="trip.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Two images layout -->
        <div v-else-if="trip.images?.length === 2" class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div class="md:col-span-2 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
            <img 
              :src="mainImage" 
              :alt="trip.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
            <img 
              :src="secondaryImages[0]?.image" 
              :alt="`${trip.name} 2`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Three or more images layout -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div class="md:col-span-2 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
            <img 
              :src="mainImage" 
              :alt="trip.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col gap-3 sm:gap-4">
            <div 
              v-for="(image, index) in secondaryImages" 
              :key="image.id"
              class="h-[120px] sm:h-[170px] md:h-[220px] lg:h-[250px] rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <img 
                :src="image.image" 
                :alt="`${trip.name} ${index + 2}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

