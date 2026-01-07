<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const { t } = useI18n()
interface Tour {
  id: number
  title: string
  duration: string
  description: string
  price: string
  image: string
}

const tours: Tour[] = [
  {
    id: 1,
    title: 'Khiva Desert & Aral Sea Adventure',
    duration: '5 Days / 4 Nights',
    description: 'Explore the ancient fortress city of Khiva and witness the haunting beauty of the Aral Sea with comfortable desert camps.',
    price: 'From 850 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 2,
    title: 'Samarkand & Bukhara Highlights',
    duration: '4 Days / 3 Nights',
    description: 'Walk through Registan Square, Shah-i-Zinda, and Poi-Kalyan with expert local guides',
    price: 'From 643 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 3,
    title: 'Fergana Valley Crafts & Nature',
    duration: '3 Days / 2 Nights',
    description: 'Discover silk weaving traditions, ceramic workshops, and stunning mountain landscapes of the Fergana Valley.',
    price: 'From 520 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 4,
    title: 'Tashkent City Explorer',
    duration: '2 Days / 1 Night',
    description: 'Experience the vibrant capital with its famous metro, bustling bazaars, and modern architecture.',
    price: 'From 320 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 5,
    title: 'Complete Silk Road Journey',
    duration: '10 Days / 9 Nights',
    description: 'The ultimate Uzbekistan experience covering all major cities and hidden gems along the ancient Silk Road.',
    price: 'From 1 500 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 6,
    title: 'Nurata Mountains & Desert Safari',
    duration: '4 Days / 3 Nights',
    description: 'Adventure through the Nurata mountains and Kyzylkum desert with yurt stays and camel rides.',
    price: 'From 720 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  }
]

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
  return ((realIndex.value + 1) / tours.length) * 100
})

const formattedIndex = computed(() => {
  return String(realIndex.value + 1).padStart(2, '0')
})

const formattedTotal = computed(() => {
  return String(tours.length).padStart(2, '0')
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

      <!-- Swiper -->
      <div class="tour-swiper-container">
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="3"
          :space-between="24"
          :centered-slides="true"
          :initial-slide="0"
          :loop="true"
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
