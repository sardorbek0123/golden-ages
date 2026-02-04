<script setup lang="ts">
interface Props {
  cityId: number
  cityName: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const hotelsStore = useHotelsStore()
const { hotels, loading } = storeToRefs(hotelsStore)

// Fetch hotels for this city
onMounted(async () => {
  await hotelsStore.fetchHotelsByCity(props.cityId)
})

// Watch for city changes
watch(() => props.cityId, async (newCityId) => {
  if (newCityId) {
    await hotelsStore.fetchHotelsByCity(newCityId)
  }
})
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="mb-8 sm:mb-10 md:mb-12">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          {{ t('hotels.title', { city: cityName }) }}
        </h2>
        <p class="text-sm sm:text-base text-gray-500 max-w-3xl leading-relaxed">
          {{ t('hotels.description', { city: cityName }) }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16 sm:py-20">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-orange-normal border-t-transparent" />
      </div>

      <!-- Empty State -->
      <div v-else-if="hotels.length === 0" class="text-center py-16 sm:py-20">
        <p class="text-gray-500 text-base sm:text-lg">{{ t('hotels.noHotels') }}</p>
      </div>

      <!-- Hotels Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- First hotel - featured (larger) -->
        <div v-if="hotels.length > 0" class="sm:row-span-2">
          <CardsHotelCard :hotel="hotels[0]" featured />
        </div>
        
        <!-- Rest of hotels -->
        <CardsHotelCard
          v-for="hotel in hotels.slice(1)"
          :key="hotel.id"
          :hotel="hotel"
        />
      </div>
    </div>
  </section>
</template>
