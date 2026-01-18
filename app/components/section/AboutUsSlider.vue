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

const progressWidth = computed(() => {
  if (items.value.length <= 2) return 100
  const maxIndex = Math.ceil(items.value.length / 2) - 1
  const currentPage = Math.floor(activeIndex.value / 2)
  return ((currentPage + 1) / (maxIndex + 1)) * 100
})

const currentPage = computed(() => Math.floor(activeIndex.value / 2) + 1)
const totalPages = computed(() => Math.ceil(items.value.length / 2))

const isPrevDisabled = computed(() => activeIndex.value === 0)
const isNextDisabled = computed(() => activeIndex.value >= items.value.length - 2)

// Format index with leading zero
const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="py-16 md:py-20 px-4">
    <div class="container mx-auto">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-12">
        <div>
          <CommonBadge :text="t('aboutUs.badge')" />
        </div>
        <div class="lg:max-w-xl">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-normal mb-4">
            {{ t('aboutUs.sliderTitle') }}
          </h2>
          <p class="text-grey-darker">
            {{ t('aboutUs.sliderDescription') }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-normal border-t-transparent" />
      </div>

      <!-- Slider -->
      <div v-else>
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="2"
          :space-between="24"
          :loop="false"
          class="about-us-swiper mb-8"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        >
          <SwiperSlide v-for="(item, index) in items" :key="item.id">
            <div class="bg-white rounded-2xl p-6 h-full border border-grey-normal">
              <div class="flex gap-6">
                <!-- Image -->
                <div class="w-64 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    :src="item.image"
                    :alt="`About us ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Number -->
                <div class="text-5xl font-bold text-dark-normal self-start">
                  {{ formatIndex(index) }}
                </div>
              </div>
              <!-- Description -->
              <p class="text-dark-normal text-lg leading-relaxed mt-6">
                {{ item.description }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Bottom Navigation -->
        <div class="flex justify-between items-center">
          <!-- Progress Bar -->
          <div class="w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              class="h-full bg-dark-normal rounded-full transition-all duration-300"
              :style="{ width: `${progressWidth}%` }"
            />
          </div>

          <!-- Page Indicator -->
          <div class="text-dark-normal font-medium">
            <span class="text-dark-normal">{{ String(currentPage).padStart(2, '0') }}</span>
            <span class="text-grey-darker">/{{ String(totalPages).padStart(2, '0') }}</span>
          </div>

          <!-- Arrows -->
          <div class="flex items-center gap-2">
            <button
              class="w-12 h-12 rounded-full border border-grey-normal flex items-center justify-center transition-all duration-300 hover:border-dark-normal disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              :disabled="isPrevDisabled"
              @click="goPrev"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              class="w-12 h-12 rounded-full bg-dark-normal text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isNextDisabled"
              @click="goNext"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
