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

const progressWidth = computed(() => {
  if (!swiperInstance.value || totalSlides.value <= 3) return 100
  const maxIndex = totalSlides.value - 3
  const progress = ((activeIndex.value) / maxIndex) * 100
  return Math.min(100, Math.max(0, progress))
})

const isNextDisabled = computed(() => {
  return activeIndex.value >= reviews.value.length - 3
})
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="relative bg-grey-normal border border-[#9195923D] rounded-3xl py-16 px-10 overflow-hidden">
        <div class="absolute inset-0 bg-right -top-90 bg-no-repeat" :style="{ backgroundImage: `url(${testimonialsBg})` }">
        </div>
        <!-- Header -->
        <div class="flex justify-between items-start mb-12 z-10 relative">
          <!-- Left Side -->
          <div class="max-w-xl">
            <!-- Badge -->
            <CommonBadge :text="t('testimonials.badge')" />
            
            <!-- Title -->
            <h2 class="text-5xl font-bold text-gray-900 leading-tight">
              {{ t('testimonials.title') }}
            </h2>
          </div>

          <!-- Right Side -->
          <div class="max-w-md text-right">
            <p class="text-gray-600 mb-6">
              {{ t('testimonials.subtitle') }}
            </p>
            <button 
              class="inline-flex items-center justify-center px-8 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide"
              @click="openModal"
            >
              {{ t('testimonials.writeReview') }}
            </button>
          </div>
        </div>

        <!-- Swiper -->
        <div class="mb-8">
          <!-- Loading State -->
          <div v-if="loading" class="flex gap-6">
            <div v-for="i in 3" :key="i" class="flex-1 bg-white rounded-2xl p-6 animate-pulse">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div class="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div class="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </div>
              <div class="flex gap-1 mb-4">
                <div v-for="j in 5" :key="j" class="w-4 h-4 bg-gray-200 rounded" />
              </div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>

          <!-- Reviews Swiper -->
          <Swiper
            v-else-if="reviews.length > 0"
            :modules="[Navigation]"
            :slides-per-view="3"
            :space-between="24"
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
          <div v-else class="text-center py-12 text-gray-500">
            {{ t('testimonials.noReviews') }}
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="flex justify-between items-center">
          <!-- Progress Bar -->
          <div class="w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gray-900 rounded-full transition-all duration-300"
              :style="{ width: `${progressWidth}%` }"
            />
          </div>

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
              :disabled="isNextDisabled"
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
  </section>

  <!-- Review Modal -->
  <ModalReviewModal :open="isModalOpen" @close="closeModal" />
</template>

<style scoped>
.testimonials-swiper {
  overflow: hidden;
}
</style>
