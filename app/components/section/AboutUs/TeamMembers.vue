<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const { t } = useI18n()
const teamStore = useTeamStore()
const { sortedMembers, loading, count } = storeToRefs(teamStore)

onMounted(async () => {
  if (!teamStore.hasMembers) {
    await teamStore.fetchTeamMembers()
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
      slidesPerView.value = 3
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
  if (sortedMembers.value.length <= slidesPerView.value) return 100
  const maxIndex = sortedMembers.value.length - slidesPerView.value
  return ((activeIndex.value + 1) / (maxIndex + 1)) * 100
})

const currentPage = computed(() => Math.floor(activeIndex.value / slidesPerView.value) + 1)
const totalPages = computed(() => Math.ceil(sortedMembers.value.length / slidesPerView.value))

const isPrevDisabled = computed(() => activeIndex.value === 0)
const isNextDisabled = computed(() => activeIndex.value >= sortedMembers.value.length - slidesPerView.value)
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
            1024: { slidesPerView: 3, spaceBetween: 24 }
          }"
          class="team-swiper"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
        >
          <SwiperSlide v-for="member in sortedMembers" :key="member.id">
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
                <p class="text-grey-darker text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{{ member.description }}</p>

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
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-swiper {
  overflow: hidden;
}
</style>
