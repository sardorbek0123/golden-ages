<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'

const { t } = useI18n()
const teamStore = useTeamStore()
const { sortedMembers, loading } = storeToRefs(teamStore)

onMounted(async () => {
  if (!teamStore.hasMembers) {
    await teamStore.fetchTeamMembers()
  }
})

// Lazy-load Swiper to eliminate render-blocking CSS in SSR
const loadSwiper = (() => {
  let promise: Promise<typeof import('swiper/vue')> | null = null
  return () => {
    if (!promise) {
      promise = Promise.all([
        import('swiper/vue'),
        // @ts-expect-error CSS side-effect import has no type declarations
        import('swiper/css')
      ]).then(([mod]) => mod)
    }
    return promise
  }
})()

const LazySwiper = defineAsyncComponent(() => loadSwiper().then(m => m.Swiper))
const LazySwiperSlide = defineAsyncComponent(() => loadSwiper().then(m => m.SwiperSlide))

// Swiper state — shallowRef avoids deep reactivity on the complex Swiper instance
const swiperInstance = shallowRef<SwiperType | null>(null)
const activeIndex = ref(0)
const isBeginning = ref(true)
const isEnd = ref(false)
const visibleSlides = ref(1)

const SWIPER_BREAKPOINTS = {
  640: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 24 }
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
  const total = sortedMembers.value.length
  const spv = visibleSlides.value
  if (total <= spv) return 100
  const maxIndex = total - spv
  return ((activeIndex.value + 1) / (maxIndex + 1)) * 100
})

const currentPage = computed(() => Math.floor(activeIndex.value / visibleSlides.value) + 1)
const totalPages = computed(() => Math.ceil(sortedMembers.value.length / visibleSlides.value))
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-10 lg:mb-12">
        <CommonBadge :text="t('team.badge')" class="mx-auto" />
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-normal mb-3 sm:mb-4">
          {{ t('team.title') }}
        </h2>
        <p class="text-sm sm:text-base text-grey-darker max-w-xl mx-auto px-4">
          {{ t('team.description') }}
        </p>
      </div>

      <!-- Navigation Bar -->
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-8">
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

      <!-- Content -->
      <ClientOnly>
        <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-orange-normal border-t-transparent" />
        </div>

        <div v-else>
          <LazySwiper
            :slides-per-view="1"
            :space-between="16"
            :loop="false"
            :breakpoints="SWIPER_BREAKPOINTS"
            class="team-swiper"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
            @breakpoint="onBreakpoint"
          >
            <LazySwiperSlide v-for="member in sortedMembers" :key="member.id">
              <div class="group">
                <!-- Image -->
                <div class="aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 bg-grey-light">
                  <NuxtImg
                    v-if="member.image"
                    :src="member.image"
                    :alt="member.full_name"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Info -->
                <div>
                  <p class="text-grey-darker text-xs sm:text-sm mb-1">{{ member.role }}</p>
                  <h3 class="text-dark-normal text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2">{{ member.full_name }}</h3>
                  <div class="text-grey-darker text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4" v-html="member.description"></div>

                  <!-- Social Links -->
                  <div class="flex items-center gap-3 sm:gap-4">
                    <a
                      v-if="member.facebook"
                      :href="member.facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-dark-normal hover:text-orange-normal transition-colors"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                    <a
                      v-if="member.linkedin"
                      :href="member.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-dark-normal hover:text-orange-normal transition-colors"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                    <a
                      v-if="member.instagram"
                      :href="member.instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-dark-normal hover:text-orange-normal transition-colors"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                    <a
                      v-if="member.twitter"
                      :href="member.twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-dark-normal hover:text-orange-normal transition-colors"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </LazySwiperSlide>
          </LazySwiper>
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
.team-swiper {
  overflow: hidden;
}
</style>
