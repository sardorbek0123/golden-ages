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
</script>

<template>
  <div class="min-h-screen bg-[#F9FAF9]">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="animate-pulse mt-12 sm:mt-16">
        <div class="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4" />
        <div class="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-1/2 mb-6 sm:mb-8" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2 h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 rounded-xl sm:rounded-2xl" />
          <div class="space-y-4">
            <div class="h-40 sm:h-48 md:h-60 bg-gray-200 rounded-xl sm:rounded-2xl" />
            <div class="h-40 sm:h-48 md:h-60 bg-gray-200 rounded-xl sm:rounded-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="text-center py-8 sm:py-10 mt-12 sm:mt-16">
        <p class="text-sm sm:text-base text-red-500 mb-4">{{ error }}</p>
        <button
          class="px-5 sm:px-6 py-2 bg-orange-normal text-white text-sm sm:text-base rounded-full hover:bg-orange-normal-hover transition-colors"
          @click="tripsStore.fetchTripBySlug(slug)">
          {{ t('common.try_again') }}
        </button>
      </div>
    </div>

    <!-- Tour Content -->
    <template v-else-if="trip">
      <!-- Hero Section: Back button, Title, Locations, Gallery -->
      <SectionTourDetailHero :trip="trip" />

      <!-- Info Section: Tour card + Description -->
      <SectionTourDetailInfo :trip="trip" />

      <!-- Tour Plan Section: Accordion -->
      <SectionTourPlan :plans="trip.plans || []" />

      <!-- Available Dates Section -->
      <SectionTourAvailableDates :prices="trip.prices || []" />

      <SectionMainTourPackages class="mt-10 sm:mt-14 md:mt-16 lg:mt-20"/>
      <SectionTestimonials />
      <SectionContactForm id="form"/>
    </template>
  </div>
</template>
