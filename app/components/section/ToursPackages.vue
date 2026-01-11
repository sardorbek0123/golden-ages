<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const tripsStore = useTripsStore()
const { t } = useI18n()

// Fetch trips on mount
onMounted(async () => {
  if (!tripsStore.hasTrips) {
    await tripsStore.fetchTrips()
  }
})

// Transform trips data for the card component
const tourPackages = computed(() => {
  return tripsStore.sortedTrips.map(trip => {
    // Parse locations string to array (assuming comma or dash separated)
    const locationsArray = trip.locations
      .split(/[,–-]/)
      .map(loc => loc.trim())
      .filter(Boolean)
    
    // Features will be added by backend later (utilities)
    const features: { icon: string; text: string }[] = []
    
    // Get first image from list response
    const image = trip.images?.[0]?.image || ''
    
    // Format price
    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(trip.price)
    
    return {
      id: trip.id,
      slug: trip.slug,
      badge: trip.label || trip.category?.name || '',
      category: trip.category?.name?.toUpperCase() || '',
      title: trip.name,
      description: trip.short_description,
      locations: locationsArray,
      features,
      rating: 4.5, // Default rating - can be updated when reviews API is integrated
      reviewCount: 0,
      ratingLabel: t('tours.excellent'),
      price: `${formattedPrice} UZS`,
      image
    }
  })
})
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <!-- Title -->
      <h2 class="text-5xl font-bold text-gray-900 text-center mb-12 italic">
        {{ t('tours.our_packages') }}
      </h2>

      <!-- Loading State -->
      <div v-if="tripsStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-normal border-t-transparent" />
      </div>

      <!-- Error State -->
      <div v-else-if="tripsStore.error" class="text-center py-20">
        <p class="text-red-500 mb-4">{{ tripsStore.error }}</p>
        <button 
          class="px-6 py-2 bg-orange-normal text-white rounded-full hover:bg-orange-normal-hover transition-colors"
          @click="tripsStore.fetchTrips()"
        >
          {{ t('common.try_again') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="tourPackages.length === 0" class="text-center py-20">
        <p class="text-gray-500">{{ t('tours.no_packages') }}</p>
      </div>

      <!-- Tour Cards -->
      <div v-else class="space-y-6">
        <CardsTourPackageCard
          v-for="tour in tourPackages"
          :key="tour.id"
          :badge="tour.badge"
          :category="tour.category"
          :title="tour.title"
          :description="tour.description"
          :locations="tour.locations"
          :features="tour.features"
          :rating="tour.rating"
          :review-count="tour.reviewCount"
          :rating-label="tour.ratingLabel"
          :price="tour.price"
          :image="tour.image"
        />
      </div>
    </div>
  </section>
</template>
