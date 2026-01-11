<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const tripsStore = useTripsStore()
const { currentTrip: trip, loadingDetail: loading, error } = storeToRefs(tripsStore)

const slug = computed(() => route.params.slug as string)

// Fetch trip on mount
onMounted(async () => {
  await tripsStore.fetchTripBySlug(slug.value)
})

// Watch for slug changes
watch(slug, async (newSlug) => {
  await tripsStore.fetchTripBySlug(newSlug)
})

// Cleanup on unmount
onUnmounted(() => {
  tripsStore.clearCurrentTrip()
})

// Format price
const formattedPrice = computed(() => {
  if (!trip.value) return ''
  return new Intl.NumberFormat('uz-UZ').format(trip.value.price) + ' UZS'
})

// Get main image
const mainImage = computed(() => {
  if (!trip.value?.images?.length) return ''
  const sorted = [...trip.value.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted[0]?.image || ''
})

// Get secondary images
const secondaryImages = computed(() => {
  if (!trip.value?.images?.length) return []
  const sorted = [...trip.value.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted.slice(1, 3)
})

// Parse utilities for display
const getUtilityValue = (name: string) => {
  const utility = trip.value?.utilities?.find(u => 
    u.name.toLowerCase().includes(name.toLowerCase())
  )
  return utility?.name || '—'
}

// Go back
const goBack = () => {
  navigateTo('/tours')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Back Button -->
      <button 
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mt-16 mb-6"
        @click="goBack"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ t('tourDetail.back') }}</span>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded w-3/4 mb-4" />
        <div class="h-6 bg-gray-200 rounded w-1/2 mb-8" />
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2 h-[500px] bg-gray-200 rounded-2xl" />
          <div class="space-y-4">
            <div class="h-60 bg-gray-200 rounded-2xl" />
            <div class="h-60 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button 
          class="px-6 py-2 bg-orange-normal text-white rounded-full hover:bg-orange-normal-hover transition-colors"
          @click="tripsStore.fetchTripBySlug(slug)"
        >
          {{ t('common.try_again') }}
        </button>
      </div>

      <!-- Tour Content -->
      <template v-else-if="trip">
        <!-- Title -->
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          {{ trip.name }}
        </h1>

        <!-- Locations -->
        <div class="flex items-center gap-2 text-gray-600 mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ trip.locations }}</span>
        </div>

        <!-- Image Gallery -->
        <div class="mb-12">
          <!-- Single image layout -->
          <div v-if="trip.images?.length === 1" class="h-[520px] rounded-2xl overflow-hidden">
            <img 
              :src="mainImage" 
              :alt="trip.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Two images layout -->
          <div v-else-if="trip.images?.length === 2" class="grid grid-cols-3 gap-4">
            <div class="col-span-2 h-[520px] rounded-2xl overflow-hidden">
              <img 
                :src="mainImage" 
                :alt="trip.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="h-[520px] rounded-2xl overflow-hidden">
              <img 
                :src="secondaryImages[0]?.image" 
                :alt="`${trip.name} 2`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Three or more images layout -->
          <div v-else class="grid grid-cols-3 gap-4">
            <div class="col-span-2 h-[520px] rounded-2xl overflow-hidden">
              <img 
                :src="mainImage" 
                :alt="trip.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex flex-col gap-4">
              <div 
                v-for="(image, index) in secondaryImages" 
                :key="image.id"
                class="flex-1 rounded-2xl overflow-hidden"
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

        <!-- Info Section -->
        <div class="bg-grey-normal rounded-3xl p-10">
          <div class="grid grid-cols-2 gap-12">
            <!-- Left Column - Tour Info Card -->
            <div class="bg-white rounded-2xl p-8 border border-gray-100">
              <!-- Category Badge -->
              <span 
                v-if="trip.category?.name"
                class="inline-block px-3 py-1 bg-orange-normal/10 text-orange-normal text-xs font-semibold rounded-full uppercase tracking-wide mb-4"
              >
                {{ trip.category.name }}
              </span>

              <!-- Title -->
              <h2 class="text-2xl font-bold text-gray-900 mb-3">
                {{ trip.label || trip.name }}
              </h2>

              <!-- Short Description -->
              <p class="text-gray-600 mb-6">
                {{ trip.short_description }}
              </p>

              <!-- Details Grid -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <!-- Duration -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6B7280" stroke-width="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.duration') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('day') }}</p>
                  </div>
                </div>

                <!-- Group Size -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.groupSize') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('traveler') }}</p>
                  </div>
                </div>

                <!-- Accommodation -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21h18M3 7v14M21 7v14M6 11h4v4H6zM14 11h4v4h-4zM9 3h6v4H9z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.accommodation') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('hotel') }}</p>
                  </div>
                </div>

                <!-- Transport -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="12" rx="2" stroke="#6B7280" stroke-width="2"/>
                      <circle cx="7" cy="19" r="2" stroke="#6B7280" stroke-width="2"/>
                      <circle cx="17" cy="19" r="2" stroke="#6B7280" stroke-width="2"/>
                      <path d="M5 16v1M19 16v1" stroke="#6B7280" stroke-width="2"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.transport') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('transport') }}</p>
                  </div>
                </div>

                <!-- Cities -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 9h1M14 9h1M9 13h1M14 13h1" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.cities') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('cit') }}</p>
                  </div>
                </div>

                <!-- Guide -->
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="#6B7280" stroke-width="2"/>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">{{ t('tourDetail.guide') }}</p>
                    <p class="text-sm font-medium text-gray-900">{{ getUtilityValue('guide') }}</p>
                  </div>
                </div>
              </div>

              <!-- Price & Book Button -->
              <div class="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p class="text-xs text-gray-400">{{ t('tourDetail.price') }}</p>
                  <p class="text-xl font-bold text-gray-900">{{ formattedPrice }} <span class="text-sm font-normal text-gray-500">{{ t('tourDetail.perPerson') }}</span></p>
                </div>
                <button class="px-8 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
                  {{ t('tourDetail.bookNow') }}
                </button>
              </div>
            </div>

            <!-- Right Column - Description -->
            <div>
              <!-- Description Badge -->
              <span class="inline-block px-3 py-1 bg-orange-normal/10 text-orange-normal text-xs font-semibold rounded-full uppercase tracking-wide mb-6">
                {{ t('tourDetail.description') }}
              </span>

              <!-- Description Text -->
              <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed" v-html="trip.description" />
            </div>
          </div>
        </div>

        <!-- Trip Plan Section -->
        <div v-if="trip.plans?.length" class="mt-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-8">{{ t('tourDetail.itinerary') }}</h3>
          
          <div class="space-y-4">
            <div 
              v-for="(plan, index) in trip.plans" 
              :key="plan.id"
              class="bg-grey-normal rounded-2xl p-6"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-orange-normal text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  {{ index + 1 }}
                </div>
                <div>
                  <p v-if="plan.label" class="text-sm text-orange-normal font-medium mb-1">{{ plan.label }}</p>
                  <h4 class="text-lg font-bold text-gray-900 mb-2">{{ plan.name }}</h4>
                  <p v-if="plan.description" class="text-gray-600">{{ plan.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

