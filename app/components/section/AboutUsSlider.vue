<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const { t } = useI18n()
const aboutUsStore = useAboutUsStore()
const { items, loading, count } = storeToRefs(aboutUsStore)

onMounted(async () => {
  if (!aboutUsStore.hasItems) {
    await aboutUsStore.fetchAboutUs()
  }
})

const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex
}

const goPrev = () => {
  swiperInstance.value?.slidePrev()
}

const goNext = () => {
  swiperInstance.value?.slideNext()
}

// Responsive slides per view
const slidesPerView = ref(1)

const updateSlidesPerView = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 1024) {
      slidesPerView.value = 2
    } else if (window.innerWidth >= 640) {
      slidesPerView.value = 2
    } else {
      slidesPerView.value = 1
    }
  }
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})

const progressWidth = computed(() => {
  if (items.value.length <= slidesPerView.value) return 100
  const maxIndex = Math.ceil(items.value.length / slidesPerView.value) - 1
  const currentPage = Math.floor(activeIndex.value / slidesPerView.value)
  return ((currentPage + 1) / (maxIndex + 1)) * 100
})

const currentPage = computed(() => Math.floor(activeIndex.value / slidesPerView.value) + 1)
const totalPages = computed(() => Math.ceil(items.value.length / slidesPerView.value))

const isPrevDisabled = computed(() => activeIndex.value === 0)
const isNextDisabled = computed(() => activeIndex.value >= items.value.length - slidesPerView.value)

// Format index with leading zero
const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
        <div>
          <CommonBadge :text="t('aboutUs.badge')" />
        </div>
        <div class="lg:max-w-xl">
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-normal mb-3 sm:mb-4">
            {{ t('aboutUs.sliderTitle') }}
          </h2>
          <p class="text-sm sm:text-base text-grey-darker">
            {{ t('aboutUs.sliderDescription') }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-orange-normal border-t-transparent" />
      </div>

      <!-- Slider -->
      <div v-else>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="1"
          :space-between="16"
          :loop="false"
          :breakpoints="{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 2, spaceBetween: 24 }
          }"
          class="about-us-swiper mb-6 sm:mb-8"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        >
          <SwiperSlide v-for="(item, index) in items" :key="item.id">
            <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 h-full border border-grey-normal">
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <!-- Image -->
                <div class="w-full sm:w-48 md:w-64 h-40 sm:h-44 md:h-48 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    :src="item.image"
                    :alt="`About us ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Number -->
                <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-normal self-start sm:self-start">
                  {{ formatIndex(index) }}
                </div>
              </div>
              <!-- Description -->
              <p class="text-dark-normal text-sm sm:text-base md:text-lg leading-relaxed mt-4 sm:mt-5 md:mt-6">
                {{ item.description }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Bottom Navigation -->
        <div class="flex flex-wrap justify-between items-center gap-4">
          <!-- Progress Bar -->
          <div class="flex-1 sm:flex-none sm:w-40 md:w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              class="h-full bg-dark-normal rounded-full transition-all duration-300"
              :style="{ width: `${progressWidth}%` }"
            />
          </div>

          <!-- Page Indicator -->
          <div class="text-sm sm:text-base text-dark-normal font-medium">
            <span class="text-dark-normal">{{ String(currentPage).padStart(2, '0') }}</span>
            <span class="text-grey-darker">/{{ String(totalPages).padStart(2, '0') }}</span>
          </div>

          <!-- Arrows -->
          <div class="flex items-center gap-2">
            <button
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-grey-normal flex items-center justify-center transition-all duration-300 hover:border-dark-normal disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              :disabled="isPrevDisabled"
              @click="goPrev"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-normal text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isNextDisabled"
              @click="goNext"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-us-swiper {
  overflow: hidden;
}
</style>
