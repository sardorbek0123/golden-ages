<script setup lang="ts">
import type { TripUtility } from '~/types/trip'

interface Props {
  slug: string
  badge: string
  category: string
  title: string
  description: string
  locations: string[]
  utilities: TripUtility[]
  rating: number
  reviewCount: number
  ratingLabel: string
  price: string
  image: string
  images?: string[]
}

const props = defineProps<Props>()

const localePath = useLocalePath()
const isHovered = ref(false)

// All photos for autoplay carousel (fallback to single image)
const photos = computed(() => {
  const imgs = props.images?.length ? props.images : [props.image]
  return imgs.filter(Boolean)
})

const currentPhotoIndex = ref(0)

// Autoplay: switch photo every 4 seconds
let autoplayTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  if (photos.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length
  }, 4000)
})
onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})

const currentPhoto = computed(() => photos.value[currentPhotoIndex.value] ?? props.image)

const getStarClass = (index: number, rating: number) => {
  if (index <= Math.floor(rating)) return 'text-orange-normal'
  if (index - 0.5 <= rating) return 'text-orange-normal opacity-50'
  return 'text-gray-300'
}
</script>

<template>
  <NuxtLink 
    :to="localePath(`/tours/${slug}`)"
    class="bg-[#F9FAF9] hover:bg-[#FFF6E666] rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-[#9195923D] hover:border-[#FFE4B0] transition-all duration-300 hover:shadow-lg block"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
      <!-- Left - Image with autoplay carousel -->
      <div class="relative w-full lg:w-[400px] h-[200px] sm:h-[250px] md:h-[280px] lg:shrink-0 rounded-xl sm:rounded-2xl overflow-hidden">
        <div class="relative w-full h-full">
          <NuxtImg
            v-for="(photo, idx) in photos"
            :key="photo"
            :src="photo"
            :alt="`${title} ${idx + 1}`"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            :class="idx === currentPhotoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
          />
        </div>
        <!-- Badge -->
        <div class="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900/80 text-white text-xs font-medium rounded-lg z-10">
          {{ badge }}
        </div>
        <!-- Dots indicator -->
        <div v-if="photos.length > 1" class="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <div
            v-for="(_, idx) in photos"
            :key="idx"
            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-opacity"
            :class="idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'"
          />
        </div>
      </div>

      <!-- Middle - Content -->
      <div class="flex-1 py-0 sm:py-2">
        <!-- Category -->
        <div class="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-300 mb-2 sm:mb-3">
          <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {{ category }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          {{ title }}
        </h3>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
          {{ description }}
        </p>

        <!-- Locations -->
        <div class="flex items-center gap-2 mb-3 sm:mb-4">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-normal shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
          <span class="text-xs sm:text-sm text-orange-normal font-medium">
            {{ locations.join(' – ') }}
          </span>
        </div>

        <!-- Utilities -->
        <div v-if="utilities && utilities.length > 0" class="flex flex-wrap gap-1.5 sm:gap-2">
          <div 
            v-for="item in utilities" 
            :key="item.id"
            class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-[#F3F3F3] rounded-full text-xs text-gray-600"
          >
            <NuxtImg 
              v-if="item.utility.icon" 
              :src="item.utility.icon" 
              :alt="item.utility.name"
              loading="lazy"
              class="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain opacity-60"
            />
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- Right - Rating & Price -->
      <div class="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-between py-0 lg:py-2 w-full lg:w-auto lg:min-w-[180px]">
        <!-- Rating -->
        <!-- <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex items-center gap-0.5">
            <svg 
              v-for="i in 5" 
              :key="i"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
              viewBox="0 0 24 24"
              :class="getStarClass(i, rating)"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="text-right hidden sm:block">
            <div class="text-xs font-medium text-green-600">{{ ratingLabel }}</div>
            <div class="text-xs text-gray-400">{{ reviewCount }} reviews</div>
          </div>
          <div class="text-lg sm:text-xl md:text-2xl font-bold text-orange-normal">
            {{ rating.toFixed(1) }}
          </div>
        </div> -->
        <div></div>

        <!-- Price & Button -->
        <div class="text-right lg:text-right">
          <div class="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
            {{ price }}
          </div>
          
          <!-- Booking Button - visible on hover (desktop) or always (mobile) -->
          <NuxtLink 
            :to="localePath('/#form')"
            v-if="isHovered"
            @click.prevent=""
            class="hidden lg:inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-xs sm:text-sm"
          >
            BOOKING NOW
          </NuxtLink>
          <NuxtLink 
            :to="localePath('/#form')"
            @click.prevent=""
            class="lg:hidden inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-xs sm:text-sm"
          >
            BOOKING NOW
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
