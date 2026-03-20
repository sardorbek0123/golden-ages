<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'

const { t } = useI18n()
const aboutUsStore = useAboutUsStore()
const { items, loading } = storeToRefs(aboutUsStore)

// Lazy-load Swiper to eliminate render-blocking CSS
const SwiperCmp = shallowRef<any>(null)
const SwiperSlideCmp = shallowRef<any>(null)

onMounted(async () => {
  const [{ Swiper, SwiperSlide }] = await Promise.all([
    import('swiper/vue'),
    // @ts-expect-error CSS side-effect import has no type declarations
    import('swiper/css')
  ])
  SwiperCmp.value = markRaw(Swiper)
  SwiperSlideCmp.value = markRaw(SwiperSlide)
})

onMounted(async () => {
  if (!aboutUsStore.hasItems) {
    await aboutUsStore.fetchAboutUs()
  }
})

const swiperInstance = shallowRef<SwiperType | null>(null)
const activeIndex = ref(0)
const isBeginning = ref(true)
const isEnd = ref(false)
const visibleSlides = ref(1)

const SWIPER_BREAKPOINTS = {
  640: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 2, spaceBetween: 24 }
} as const

const syncState = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
  const spv = swiper.params.slidesPerView
  visibleSlides.value = typeof spv === 'number' ? spv : 1
}

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  syncState(swiper)
}

const onSlideChange = (swiper: SwiperType) => syncState(swiper)
const onBreakpoint = (swiper: SwiperType) => syncState(swiper)

const goPrev = () => swiperInstance.value?.slidePrev()
const goNext = () => swiperInstance.value?.slideNext()

const progressWidth = computed(() => {
  const total = items.value.length
  const spv = visibleSlides.value
  if (total <= spv) return 100
  const maxIndex = Math.ceil(total / spv) - 1
  const currentPageVal = Math.floor(activeIndex.value / spv)
  return ((currentPageVal + 1) / (maxIndex + 1)) * 100
})

const currentPage = computed(() => Math.floor(activeIndex.value / visibleSlides.value) + 1)
const totalPages = computed(() => Math.ceil(items.value.length / visibleSlides.value))

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

      <!-- Content -->
      <ClientOnly>
        <div v-if="loading || !SwiperCmp" class="flex items-center justify-center py-12 sm:py-16">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-orange-normal border-t-transparent" />
        </div>

        <div v-else>
          <component
            :is="SwiperCmp"
            :slides-per-view="1"
            :space-between="16"
            :loop="false"
            :breakpoints="SWIPER_BREAKPOINTS"
            class="about-us-swiper mb-6 sm:mb-8"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
            @breakpoint="onBreakpoint"
          >
            <component
              :is="SwiperSlideCmp"
              v-for="(item, index) in items"
              :key="item.id"
            >
              <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 h-full border border-grey-normal">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <!-- Image -->
                  <div class="w-full sm:w-48 md:w-64 h-40 sm:h-44 md:h-48 shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                    <NuxtImg
                      :src="item.image"
                      :alt="`About us ${index + 1}`"
                      loading="lazy"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <!-- Number -->
                  <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-normal self-start sm:self-start">
                    {{ formatIndex(index) }}
                  </div>
                </div>
                <!-- Description -->
                <div class="text-dark-normal text-sm sm:text-base md:text-lg leading-relaxed mt-4 sm:mt-5 md:mt-6"
                   v-html="item.description">
                </div>
              </div>
            </component>
          </component>

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
                :disabled="isBeginning"
                @click="goPrev"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-normal text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                :disabled="isEnd"
                @click="goNext"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <template #fallback>
          <div class="flex items-center justify-center py-12 sm:py-16">
            <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-orange-normal border-t-transparent" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
.about-us-swiper {
  overflow: hidden;
}
</style>
