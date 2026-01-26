<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import testimonialsBg from '~/assets/images/testimonial.png'

const { t } = useI18n()
const reviewsStore = useReviewsStore()
const { sortedReviews: reviews, loading } = storeToRefs(reviewsStore)

// Fetch reviews on mount
onMounted(() => {
  reviewsStore.fetchHomeReviews()
})

// Modal state
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)
const totalSlides = ref(0)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  totalSlides.value = swiper.slides.length
}

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.activeIndex
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
  if (!swiperInstance.value || totalSlides.value <= slidesPerView.value) return 100
  const maxIndex = totalSlides.value - slidesPerView.value
  const progress = ((activeIndex.value) / maxIndex) * 100
  return Math.min(100, Math.max(0, progress))
})

const isNextDisabled = computed(() => {
  return activeIndex.value >= reviews.value.length - slidesPerView.value
})
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="relative bg-grey-normal border border-[#9195923D] rounded-2xl sm:rounded-3xl py-8 sm:py-12 md:py-14 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden">
        <div class="absolute inset-0 bg-right -top-90 bg-no-repeat opacity-50 lg:opacity-100" :style="{ backgroundImage: `url(${testimonialsBg})` }">
        </div>
        <!-- Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 z-10 relative">
          <!-- Left Side -->
          <div class="max-w-xl">
            <!-- Badge -->
            <CommonBadge :text="t('testimonials.badge')" />
            
            <!-- Title -->
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {{ t('testimonials.title') }}
            </h2>
          </div>

          <!-- Right Side -->
          <div class="lg:max-w-md lg:text-right">
            <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {{ t('testimonials.subtitle') }}
            </p>
            <button 
              class="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-normal text-white text-sm sm:text-base font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide"
              @click="openModal"
            >
              {{ t('testimonials.writeReview') }}
            </button>
          </div>
        </div>

        <!-- Swiper -->
        <div class="mb-6 sm:mb-8 relative z-10">
          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div v-for="i in slidesPerView" :key="i" class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse">
              <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full" />
                <div>
                  <div class="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded mb-2" />
                  <div class="h-2.5 sm:h-3 w-16 sm:w-20 bg-gray-200 rounded" />
                </div>
              </div>
              <div class="flex gap-1 mb-3 sm:mb-4">
                <div v-for="j in 5" :key="j" class="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded" />
              </div>
              <div class="space-y-2">
                <div class="h-2.5 sm:h-3 bg-gray-200 rounded w-full" />
                <div class="h-2.5 sm:h-3 bg-gray-200 rounded w-full" />
                <div class="h-2.5 sm:h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>

          <!-- Reviews Swiper -->
          <Swiper
            v-else-if="reviews.length > 0"
            :modules="[Navigation]"
            :slides-per-view="1"
            :space-between="16"
            :breakpoints="{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 }
            }"
            :loop="false"
            class="testimonials-swiper"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          >
            <SwiperSlide v-for="review in reviews" :key="review.id">
              <CardsReviewCard
                :name="review.full_name"
                :role="review.role"
                :avatar="review.avatar"
                :rating="review.rating"
                :review="review.review"
              />
            </SwiperSlide>
          </Swiper>

          <!-- Empty State -->
          <div v-else class="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            {{ t('testimonials.noReviews') }}
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="flex justify-between items-center gap-4 relative z-10">
          <!-- Progress Bar -->
          <div class="flex-1 sm:flex-none sm:w-32 md:w-40 lg:w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gray-900 rounded-full transition-all duration-300"
              :style="{ width: `${progressWidth}%` }"
            />
          </div>

          <!-- Arrows -->
          <div class="flex items-center gap-2">
            <button
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              :disabled="activeIndex === 0"
              @click="goPrev"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              :disabled="isNextDisabled"
              @click="goNext"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Review Modal -->
  <ModalReviewModal :open="isModalOpen" @close="closeModal" />
</template>

<style scoped>
.testimonials-swiper {
  overflow: hidden;
}
</style>
