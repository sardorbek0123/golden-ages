<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'

const { t } = useI18n()
const tripsStore = useTripsStore()

// Fetch trips on mount
onMounted(async () => {
  if (!tripsStore.hasTrips) {
    await tripsStore.fetchTrips()
  }
})

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

// Transform trips data for the card component
const tours = computed(() => {
  return tripsStore.sortedTrips.map(trip => {
    // Get first image from list response
    const image = trip.images?.[0]?.image || ''
    
    // Format price with appropriate currency
    const currencyLabel = getCurrencyLabel(trip.currency?.key)
    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(trip.price)
    const formattedDiscountPrice = trip.discount_price != null
      ? `${new Intl.NumberFormat('uz-UZ').format(trip.discount_price)} ${currencyLabel}`
      : undefined

    // Duration will be added by backend later
    const duration = ''

    return {
      id: trip.id,
      slug: trip.slug,
      title: trip.name,
      duration,
      description: trip.short_description,
      price: `${t('common.from')} ${formattedPrice} ${currencyLabel}`,
      image,
      discount: trip.discount ?? false,
      discount_price: formattedDiscountPrice
    }
  })
})

const swiperInstance = ref<SwiperType | null>(null)
const realIndex = ref(0)

const SwiperCmp = shallowRef<unknown>(null)
const SwiperSlideCmp = shallowRef<unknown>(null)
const swiperModules = shallowRef<unknown[]>([])

onMounted(async () => {
  const [{ Swiper, SwiperSlide }, { Navigation, Autoplay }] = await Promise.all([
    import('swiper/vue'),
    import('swiper/modules'),
    import('swiper/css'),
    import('swiper/css/navigation')
  ])
  SwiperCmp.value = markRaw(Swiper)
  SwiperSlideCmp.value = markRaw(SwiperSlide)
  swiperModules.value = [Navigation, Autoplay]
})

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
  <section class="py-10 sm:py-12 md:py-14 lg:py-16 bg-white">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex flex-col-reverse sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Left - Badge -->
        <div class="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-300">
          <span class="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
            {{ t('tourPackages.badge') }}
          </span>
        </div>

        <!-- Right - Title and Description -->
        <div class="max-w-xl sm:text-right">
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2 sm:mb-4">
            {{ t('tourPackages.title') }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600">
            {{ t('tourPackages.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Navigation Row -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <!-- Progress Bar -->
        <div class="order-1 flex-1 sm:flex-none sm:w-40 md:w-52 lg:w-64 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gray-900 rounded-full transition-all duration-300"
            :style="{ width: `${progressWidth}%` }"
          />
        </div>

        <!-- Counter -->
        <div class="order-3 sm:order-2 flex items-center gap-1">
          <span class="text-base sm:text-lg font-bold text-gray-900">{{ formattedIndex }}</span>
          <span class="text-base sm:text-lg text-gray-400">/{{ formattedTotal }}</span>
        </div>

        <!-- Arrows -->
        <div class="order-2 sm:order-3 flex items-center gap-2">
          <button
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-gray-900"
            @click="goPrev"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800"
            @click="goNext"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="tripsStore.loading" class="flex justify-center items-center py-12 sm:py-16 lg:py-20">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-orange-normal border-t-transparent" />
      </div>

      <!-- Swiper (client-only + dynamic import = non-render-blocking Swiper CSS) -->
      <ClientOnly v-else-if="tours.length > 0">
        <div v-if="!SwiperCmp" class="tour-swiper-container flex items-center justify-center py-12 sm:py-16 lg:py-20">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-orange-normal border-t-transparent" />
        </div>
        <div v-else class="tour-swiper-container">
          <component
            :is="SwiperCmp"
            :modules="swiperModules"
            :auto-height="false"
            :slides-per-view="1"
            :space-between="16"
            :centered-slides="true"
            :initial-slide="0"
            :loop="tours.length >= 3"
            :breakpoints="{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 }
            }"
            class="tour-packages-swiper"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
            :autoplay="{
              delay: 2500,
              disableOnInteraction: false,
            }"
          >
            <component
              :is="SwiperSlideCmp"
              v-for="(tour, index) in tours"
              :key="tour.id"
            >
              <CardsTourCard
                :slug="tour.slug"
                :title="tour.title"
                :duration="tour.duration"
                :description="tour.description"
                :price="tour.price"
                :image="tour.image"
                :is-active="index === realIndex"
                :discount="tour.discount"
                :discount_price="tour.discount_price"
              />
            </component>
          </component>
        </div>
        <template #fallback>
          <div class="tour-swiper-container flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-orange-normal border-t-transparent" />
          </div>
        </template>
      </ClientOnly>

      <!-- Empty State -->
      <div v-else class="text-center py-12 sm:py-16 lg:py-20">
        <p class="text-sm sm:text-base text-gray-500">{{ t('tours.no_packages') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tour-packages-swiper {
  overflow: hidden; /* prevents content overflow from affecting layout */
  padding-bottom: 20px;
}

.tour-packages-swiper :deep(.swiper-slide-active) {
  z-index: 10;
}

.tour-swiper-container {
  overflow: hidden;
  /* Lock height to prevent jump when active slide changes */
  min-height: 520px;
}

@media (min-width: 640px) {
  .tour-swiper-container {
    min-height: 660px;
  }
}

@media (min-width: 768px) {
  .tour-swiper-container {
    min-height: 760px;
  }
}

@media (min-width: 1024px) {
  .tour-swiper-container {
    min-height: 860px;
  }
}

/* Fix height jump: fixed height = active card, prevents layout jump on autoplay */
.tour-packages-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

.tour-packages-swiper :deep(.swiper-slide) {
  transition: transform 0.5s ease;
  height: 500px; /* mobile: active image 280px + content ~220px */
}

@media (min-width: 640px) {
  .tour-packages-swiper :deep(.swiper-slide) {
    height: 640px; /* sm: image 400px + content ~240px */
  }
}

@media (min-width: 768px) {
  .tour-packages-swiper :deep(.swiper-slide) {
    height: 740px; /* md: image 500px + content ~240px */
  }
}

@media (min-width: 1024px) {
  .tour-packages-swiper :deep(.swiper-slide) {
    height: 840px; /* lg: image 600px + content ~240px */
  }
}
</style>
