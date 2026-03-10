<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const tripsStore = useTripsStore()
const route = useRoute()
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

// Get category from URL query parameter
const categorySlug = computed(() => route.query.category as string | undefined)

// Fetch trips on mount and when category changes
onMounted(async () => {
  await fetchTripsWithCategory()
})

// Watch for category changes in URL
watch(() => route.query.category, async () => {
  await fetchTripsWithCategory()
})

async function fetchTripsWithCategory() {
  const params = categorySlug.value ? { category: categorySlug.value } : undefined
  await tripsStore.fetchTrips(params)
}

// Transform trips data for the card component
const tourPackages = computed(() => {
  return tripsStore.sortedTrips.map(trip => {
    // Parse locations string to array (assuming comma or dash separated)
    const locationsArray = trip.locations
      .split(/[,–-]/)
      .map(loc => loc.trim())
      .filter(Boolean)
    
    // Get utilities from API, sorted by order
    const utilities = (trip.trip_utilities || [])
      .slice()
      .sort((a, b) => (a.utility.order ?? 0) - (b.utility.order ?? 0))
    
    // All images sorted by order (for autoplay carousel)
    const images = (trip.images ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(img => img.image)
      .filter(Boolean)
    const image = images[0] ?? ''

    // Format price with currency
    const currencyLabel = getCurrencyLabel(trip.currency?.key)
    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(trip.price)
    const formattedDiscountPrice = trip.discount_price != null
      ? `${new Intl.NumberFormat('uz-UZ').format(trip.discount_price)} ${currencyLabel}`
      : undefined

    return {
      id: trip.id,
      slug: trip.slug,
      badge: trip.label || trip.category?.name || '',
      category: trip.category?.name?.toUpperCase() || '',
      title: trip.name,
      description: trip.short_description,
      locations: locationsArray,
      utilities,
      rating: 4.5, // Default rating - can be updated when reviews API is integrated
      reviewCount: 0,
      ratingLabel: t('tours.excellent'),
      price: `${formattedPrice} ${currencyLabel}`,
      image,
      images,
      discount: trip.discount ?? false,
      discount_price: formattedDiscountPrice
    }
  })
})
</script>

<template>
  <section class="py-10 sm:py-12 md:py-14 lg:py-16">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Title -->
      <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-8 sm:mb-10 md:mb-12 italic">
        {{ t('tours.our_packages') }}
      </h2>

      <!-- Loading State -->
      <div v-if="tripsStore.loading" class="flex justify-center items-center py-12 sm:py-16 md:py-20">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-4 border-orange-normal border-t-transparent" />
      </div>

      <!-- Error State -->
      <div v-else-if="tripsStore.error" class="text-center py-12 sm:py-16 md:py-20">
        <p class="text-sm sm:text-base text-red-500 mb-4">{{ tripsStore.error }}</p>
        <button 
          class="px-5 sm:px-6 py-2 bg-orange-normal text-white text-sm sm:text-base rounded-full hover:bg-orange-normal-hover transition-colors"
          @click="tripsStore.fetchTrips()"
        >
          {{ t('common.try_again') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="tourPackages.length === 0" class="text-center py-12 sm:py-16 md:py-20">
        <p class="text-sm sm:text-base text-gray-500">{{ t('tours.no_packages') }}</p>
      </div>

      <!-- Tour Cards -->
      <div v-else class="space-y-4 sm:space-y-5 md:space-y-6">
        <CardsTourPackageCard
          v-for="tour in tourPackages"
          :key="tour.id"
          :slug="tour.slug"
          :badge="tour.badge"
          :category="tour.category"
          :title="tour.title"
          :description="tour.description"
          :locations="tour.locations"
          :utilities="tour.utilities"
          :rating="tour.rating"
          :review-count="tour.reviewCount"
          :rating-label="tour.ratingLabel"
          :price="tour.price"
          :image="tour.image"
          :images="tour.images"
          :discount="tour.discount"
          :discount_price="tour.discount_price"
        />
      </div>
    </div>
  </section>
</template>
