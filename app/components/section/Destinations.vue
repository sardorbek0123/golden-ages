<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import destinationsBg from '~/assets/images/destinations_bg.png'
import { useCitiesStore } from '~/stores'

const { t } = useI18n()
const citiesStore = useCitiesStore()

// Fetch cities on component mount
await citiesStore.fetchCities()

// Use sorted cities from store
const cities = computed(() => citiesStore.sortedCities)

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

const currentCity = computed(() => cities.value[activeIndex.value])
</script>

<template>
  <section v-if="cities.length > 0" class="relative py-20 overflow-hidden bg-orange-light-active">
    <!-- Background Image -->
    <div
      class="absolute -top-22 inset-0 bg-left bg-no-repeat"
      :style="{ backgroundImage: `url(${destinationsBg})` }"
    />

    <div class="relative">
      <!-- Header -->
      <div class="flex justify-between items-start mb-12 container mx-auto px-4">
        <div class="max-w-2xl">
          <!-- Badge -->
          <CommonBadge :text="t('destinations.badge')" />


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
      <div class="grid grid-cols-12 gap-5 items-stretch">
        <!-- Left Content -->
        <div class="col-span-1"></div>
        <div class="col-span-2 flex flex-col justify-end items-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {{ currentCity?.name }}
          </h3>
          <p class="text-gray-600 text-sm">
            {{ currentCity?.location }}
          </p>
        </div>
        <!-- <div class="col-span-0.5"></div> -->


        <!-- Center Swiper -->
        <div class="col-span-6 flex flex-col">
          <Swiper
            :modules="[Navigation, EffectFade]"
            :slides-per-view="1"
            :space-between="0"
            :loop="false"
            effect="fade"
            class="destinations-swiper overflow-hidden w-full"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          >
          <pre>{{ cities }}</pre>
            <SwiperSlide v-for="city in cities" :key="city.id">
              <div class="relative">
                <NuxtImg
                  :src="city.image"
                  :alt="city.name"
                  class="w-[1024px] h-[680px] object-cover rounded-2xl"
                />
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- Bottom Navigation - под центральным слайдером -->
          <div class="flex justify-between items-center mt-6">
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
                :disabled="cities.length === 0 || activeIndex === cities.length - 1"
                @click="goNext"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Right - Next Slide Preview -->
        <div class="col-span-3 flex items-stretch">
          <div
            v-if="cities.length > 0 && activeIndex < cities.length - 1"
            class="overflow-hidden w-full"
          >
          <pre>{{ cities[activeIndex + 1]?.image }}</pre>
            <NuxtImg
              :src="cities[activeIndex + 1]?.image"
              :alt="cities[activeIndex + 1]?.name"
              class="w-[1024px] h-[680px] object-cover rounded-l-2xl"
            />
          </div>
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
