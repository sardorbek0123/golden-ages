<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, EffectFade, Autoplay } from 'swiper/modules'
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
const cities = computed(() => citiesStore.cities)

const mobileSwiperInstance = ref<SwiperType | null>(null)
const desktopSwiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const onMobileSwiper = (swiper: SwiperType) => {
  mobileSwiperInstance.value = swiper
}

const onDesktopSwiper = (swiper: SwiperType) => {
  desktopSwiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  // Only update if actually changed to avoid loops
  if (activeIndex.value !== swiper.activeIndex) {
    activeIndex.value = swiper.activeIndex
  }
}

const goToSlide = (index: number) => {
  activeIndex.value = index
  mobileSwiperInstance.value?.slideTo(index)
  desktopSwiperInstance.value?.slideTo(index)
}

const goPrev = () => {
  if (activeIndex.value > 0) {
    goToSlide(activeIndex.value - 1)
  }
}

const goNext = () => {
  if (activeIndex.value < cities.value.length - 1) {
    goToSlide(activeIndex.value + 1)
  }
}

const currentCity = computed(() => cities.value[activeIndex.value])
const nextCity = computed(() => {
  const idx = activeIndex.value + 1
  return idx < cities.value.length ? cities.value[idx] : null
})
const localePath = useLocalePath()

const getCityUrl = (city: { slug: string }) => localePath(`/cities/${city.slug}`)
</script>

<template>
  <section v-if="cities.length > 0" class="relative py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden bg-orange-light-active">
    <!-- Background Image -->
    <div
      class="absolute -top-22 inset-0 bg-left bg-no-repeat opacity-50 lg:opacity-100"
      :style="{ backgroundImage: `url(${destinationsBg})` }"
    />

    <div class="relative">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 container mx-auto px-4 sm:px-6">
        <div class="max-w-2xl">
          <!-- Badge -->
          <CommonBadge :text="t('destinations.badge')" />

          <!-- Title -->
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {{ t('destinations.title') }}
          </h2>
        </div>

        <!-- City List - Hidden on mobile, horizontal scroll on tablet, vertical on desktop -->
        <div class="flex lg:flex-col gap-3 sm:gap-4 lg:gap-3 text-left lg:text-right overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
          <NuxtLink
            v-for="(city, index) in cities"
            :key="city.id"
            :to="getCityUrl(city)"
            class="text-sm sm:text-base lg:text-xl transition-all duration-300 whitespace-nowrap"
            :class="[
              activeIndex === index
                ? 'font-bold text-gray-900'
                : 'font-normal text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ city.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile/Tablet Layout -->
      <div class="lg:hidden container mx-auto px-4 sm:px-6">
        <!-- City Info -->
        <NuxtLink
          v-if="currentCity"
          :to="getCityUrl(currentCity)"
          class="flex flex-col items-center mb-4 sm:mb-6 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight text-center">
            {{ currentCity.name }}
          </h3>
          <p class="text-gray-600 text-xs sm:text-sm text-center">
            {{ currentCity.location }}
          </p>
        </NuxtLink>

        <!-- Swiper -->
        <Swiper
          :modules="[Navigation, EffectFade, Autoplay]"
          :slides-per-view="1"
          :space-between="0"
          :loop="false"
          effect="fade"
          class="destinations-swiper overflow-hidden w-full rounded-xl sm:rounded-2xl"
          @swiper="onMobileSwiper"
          @slide-change="onSlideChange"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
          }"
        >
          <SwiperSlide
            v-for="city in cities"
            :key="`mobile-${city.id}-${city.image}`"
          >
            <NuxtLink :to="getCityUrl(city)" class="block cursor-pointer">
              <NuxtImg
                :src="city.image"
                :alt="city.name"
                loading="lazy"
                class="w-full aspect-4/3 sm:aspect-video object-cover"
              />
            </NuxtLink>
          </SwiperSlide>
        </Swiper>

        <!-- Navigation -->
        <div class="flex justify-center items-center mt-4 sm:mt-6 gap-3">
          <button
            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed bg-white"
            :disabled="activeIndex === 0"
            @click="goPrev"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <!-- Dots indicator -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            <button
              v-for="(_, index) in cities"
              :key="`dot-${index}`"
              class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
              :class="activeIndex === index ? 'bg-gray-900 w-4 sm:w-6' : 'bg-gray-300 hover:bg-gray-400'"
              @click="goToSlide(index)"
            />
          </div>
          <button
            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="cities.length === 0 || activeIndex === cities.length - 1"
            @click="goNext"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden lg:grid grid-cols-12 gap-5">
        <!-- Left Content -->
        <div class="col-span-1"></div>
        <NuxtLink
          v-if="currentCity"
          :to="getCityUrl(currentCity)"
          class="col-span-2 flex flex-col justify-end items-center pb-16 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h3 class="text-xl xl:text-2xl font-bold text-gray-900 mb-3 leading-tight text-center">
            {{ currentCity.name }}
          </h3>
          <p class="text-gray-600 text-xs xl:text-sm text-center">
            {{ currentCity.location }}
          </p>
        </NuxtLink>

        <!-- Center Swiper + Right Preview Row -->
        <div class="col-span-9 flex flex-col">
          <!-- Images Row -->
          <div class="flex gap-5 items-stretch">
            <!-- Center Swiper -->
            <div class="w-2/3">
              <Swiper
                :modules="[Navigation, EffectFade, Autoplay]"
                :slides-per-view="1"
                :space-between="0"
                :loop="false"
                effect="fade"
                class="destinations-swiper overflow-hidden w-full h-full rounded-2xl"
                @swiper="onDesktopSwiper"
                @slide-change="onSlideChange"
                :autoplay="{
                  delay: 2500,
                  disableOnInteraction: false,
                }"
              >
                <SwiperSlide
                  v-for="city in cities"
                  :key="`desktop-${city.id}-${city.image}`"
                  class="h-auto!"
                >
                  <NuxtLink :to="getCityUrl(city)" class="block cursor-pointer">
                    <NuxtImg
                      :src="city.image"
                      :alt="city.name"
                      loading="lazy"
                      class="w-full aspect-3/2 object-cover"
                    />
                  </NuxtLink>
                </SwiperSlide>
              </Swiper>
            </div>

            <!-- Right - Next Slide Preview -->
            <NuxtLink
              v-if="nextCity"
              :to="getCityUrl(nextCity)"
              class="w-1/3 overflow-hidden block cursor-pointer"
            >
              <NuxtImg
                :src="nextCity.image"
                :alt="nextCity.name"
                loading="lazy"
                class="w-full h-full object-cover rounded-l-2xl"
              />
            </NuxtLink>
          </div>

          <!-- Bottom Navigation -->
          <div class="flex justify-start items-center mt-6">
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.destinations-swiper {
  width: 100%;
}

/* Hide scrollbar for city list */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
