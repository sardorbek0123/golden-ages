<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import destinationsBg from '~/assets/images/destinations_bg.png'
const { t } = useI18n()

interface City {
  id: number
  name: string
  title: string
  subtitle: string
  description: string
  image: string
}

const cities: City[] = [
  {
    id: 1,
    name: 'Tashkent',
    title: 'Tashkent — The Heart of Modern Uzbekistan',
    subtitle: 'Amir Temur Square or Hazrati Imam Complex',
    description: '',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 2,
    name: 'Samarkand',
    title: 'Samarkand — The Jewel of the Silk Road',
    subtitle: 'Registan Square and Shah-i-Zinda',
    description: '',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 3,
    name: 'Bukhara',
    title: 'Bukhara — The City of Living History',
    subtitle: 'Poi Kalon Complex and Ark Fortress',
    description: '',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 4,
    name: 'Khiva',
    title: 'Khiva — An Open-Air Museum',
    subtitle: 'Itchan Kala and Kalta Minor Minaret',
    description: '',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 5,
    name: 'Fergana',
    title: 'Fergana — The Heart of the Valley',
    subtitle: 'Silk factories and traditional crafts',
    description: '',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  }
]

const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex
}

const goToSlide = (index: number) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
  }
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

const currentCity = computed(() => cities[activeIndex.value])
</script>

<template>
  <section class="relative py-20 overflow-hidden">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${destinationsBg})` }"
    />
    
    <!-- Decorative Plane -->
    <div class="absolute left-0 top-1/3 w-48 h-48 opacity-20">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 100 L180 100 M100 20 L100 180 M40 40 L160 160 M160 40 L40 160" stroke="#D4A853" stroke-width="2"/>
      </svg>
    </div>

    <div class="relative container mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-start mb-12">
        <div class="max-w-2xl">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-normal mb-6">
            <span class="text-sm font-medium text-white uppercase tracking-wide">
              {{ t('destinations.badge') }}
            </span>
          </div>
          
          <!-- Title -->
          <h2 class="text-5xl font-bold text-gray-900 leading-tight">
            {{ t('destinations.title') }}
          </h2>
        </div>

        <!-- City List -->
        <div class="flex flex-col gap-3 text-right">
          <button
            v-for="(city, index) in cities"
            :key="city.id"
            class="text-xl transition-all duration-300 text-right"
            :class="[
              activeIndex === index 
                ? 'font-bold text-gray-900' 
                : 'font-normal text-gray-500 hover:text-gray-700'
            ]"
            @click="goToSlide(index)"
          >
            {{ city.name }}
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-12 gap-8 items-end">
        <!-- Left Content -->
        <div class="col-span-3 pb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ currentCity.title }}
          </h3>
          <p class="text-gray-600">
            {{ currentCity.subtitle }}
          </p>
        </div>

        <!-- Center Swiper -->
        <div class="col-span-6">
          <Swiper
            :modules="[Navigation, EffectFade]"
            :slides-per-view="1"
            :space-between="0"
            :loop="false"
            effect="fade"
            class="destinations-swiper rounded-2xl overflow-hidden"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          >
            <SwiperSlide v-for="city in cities" :key="city.id">
              <div class="aspect-4/3 relative">
                <img
                  :src="city.image"
                  :alt="city.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- Right - Next Slide Preview -->
        <div class="col-span-3">
          <div 
            v-if="activeIndex < cities.length - 1" 
            class="rounded-2xl overflow-hidden aspect-4/3"
          >
            <img
              :src="cities[activeIndex + 1]?.image"
              :alt="cities[activeIndex + 1]?.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="flex justify-between items-center mt-8">
        <!-- Arrows -->
        <div class="flex items-center gap-2">
          <button
            class="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed bg-white"
            :disabled="activeIndex === 0"
            @click="goPrev"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="activeIndex === cities.length - 1"
            @click="goNext"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.destinations-swiper {
  width: 100%;
}
</style>
