<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const { t } = useI18n()
const tripsStore = useTripsStore()

// Fetch trips on mount
onMounted(async () => {
  if (!tripsStore.hasTrips) {
    await tripsStore.fetchTrips()
  }
})

// Transform trips data for the card component
const tours = computed(() => {
  return tripsStore.sortedTrips.map(trip => {
    // Get first image from list response
    const image = trip.images?.[0]?.image || ''
    
    // Format price
    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(trip.price)
    
    // Duration will be added by backend later
    const duration = ''
    
    return {
      id: trip.id,
      slug: trip.slug,
      title: trip.name,
      duration,
      description: trip.short_description,
      price: `${t('common.from')} ${formattedPrice} UZS`,
      image
    }
  })
})

const swiperInstance = ref<SwiperType | null>(null)
const realIndex = ref(0)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  realIndex.value = swiper.realIndex
}

const onSlideChange = (swiper: SwiperType) => {
  realIndex.value = swiper.realIndex
}

const goPrev = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  }
}

const goNext = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  }
}

const progressWidth = computed(() => {
  const total = tours.value.length || 1
  return ((realIndex.value + 1) / total) * 100
})

const formattedIndex = computed(() => {
  return String(realIndex.value + 1).padStart(2, '0')
})

const formattedTotal = computed(() => {
  return String(tours.value.length).padStart(2, '0')
})
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <!-- Left - Badge -->
        <div class="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-300">
          <span class="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {{ t('tourPackages.badge') }}
          </span>
        </div>

        <!-- Right - Title and Description -->
        <div class="max-w-xl text-right">
          <h2 class="text-5xl font-bold text-gray-900 leading-tight mb-4">
            {{ t('tourPackages.title') }}
          </h2>
          <p class="text-gray-600">
            {{ t('tourPackages.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Navigation Row -->
      <div class="flex items-center justify-between mb-8">
        <!-- Progress Bar -->
        <div class="w-64 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gray-900 rounded-full transition-all duration-300"
            :style="{ width: `${progressWidth}%` }"
          />
        </div>

        <!-- Counter -->
        <div class="flex items-center gap-1">
          <span class="text-lg font-bold text-gray-900">{{ formattedIndex }}</span>
          <span class="text-lg text-gray-400">/{{ formattedTotal }}</span>
        </div>

        <!-- Arrows -->
        <div class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-gray-900"
            @click="goPrev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800"
            @click="goNext"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="tripsStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-normal border-t-transparent" />
      </div>

      <!-- Swiper -->
      <div v-else-if="tours.length > 0" class="tour-swiper-container">
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="3"
          :space-between="24"
          :centered-slides="true"
          :initial-slide="0"
          :loop="tours.length >= 3"
          class="tour-packages-swiper"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        >
          <SwiperSlide v-for="(tour, index) in tours" :key="tour.id">
            <CardsTourCard
              :title="tour.title"
              :duration="tour.duration"
              :description="tour.description"
              :price="tour.price"
              :image="tour.image"
              :is-active="index === realIndex"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-500">{{ t('tours.no_packages') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tour-packages-swiper {
  overflow: visible;
  padding-bottom: 20px;
}

.tour-packages-swiper :deep(.swiper-slide) {
  transition: all 0.5s ease;
}

.tour-packages-swiper :deep(.swiper-slide-active) {
  z-index: 10;
}

.tour-swiper-container {
  overflow: hidden;
}
</style>
