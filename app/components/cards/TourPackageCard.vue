<script setup lang="ts">
interface Feature {
  icon: string
  text: string
}

interface Props {
  slug: string
  badge: string
  category: string
  title: string
  description: string
  locations: string[]
  features: Feature[]
  rating: number
  reviewCount: number
  ratingLabel: string
  price: string
  image: string
}

defineProps<Props>()

const isHovered = ref(false)

const getStarClass = (index: number, rating: number) => {
  if (index <= Math.floor(rating)) return 'text-orange-normal'
  if (index - 0.5 <= rating) return 'text-orange-normal opacity-50'
  return 'text-gray-300'
}
</script>

<template>
  <NuxtLink 
    :to="`/tours/${slug}`"
    class="bg-white rounded-3xl p-4 border border-gray-100 transition-all duration-300 hover:shadow-lg block"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="flex gap-6">
      <!-- Left - Image -->
      <div class="relative w-[400px] h-[280px] shrink-0 rounded-2xl overflow-hidden">
        <img
          :src="image"
          :alt="title"
          class="w-full h-full object-cover"
        />
        <!-- Badge -->
        <div class="absolute top-4 left-4 px-3 py-1.5 bg-gray-900/80 text-white text-xs font-medium rounded-lg">
          {{ badge }}
        </div>
        <!-- Dots indicator -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div class="w-2 h-2 rounded-full bg-white" />
          <div class="w-2 h-2 rounded-full bg-white/50" />
          <div class="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      <!-- Middle - Content -->
      <div class="flex-1 py-2">
        <!-- Category -->
        <div class="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 mb-3">
          <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {{ category }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-gray-900 mb-3">
          {{ title }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-500 leading-relaxed mb-4">
          {{ description }}
        </p>

        <!-- Locations -->
        <div class="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-orange-normal">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
          <span class="text-sm text-orange-normal font-medium">
            {{ locations.join(' – ') }}
          </span>
        </div>

        <!-- Features -->
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="feature in features" 
            :key="feature.text"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600"
          >
            <svg v-if="feature.icon === 'clock'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <svg v-else-if="feature.icon === 'hotel'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M3 7v14M21 7v14M6 11h4M14 11h4M6 15h4M14 15h4M10 21V11M14 21V11M3 7l9-4 9 4"/>
            </svg>
            <svg v-else-if="feature.icon === 'group'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <svg v-else-if="feature.icon === 'transport'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 17h14v-5H5v5zM5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M7 17v2M17 17v2M7 14h.01M17 14h.01"/>
            </svg>
            <svg v-else-if="feature.icon === 'food'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            <svg v-else-if="feature.icon === 'guide'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
            </svg>
            <svg v-else-if="feature.icon === 'wifi'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
            </svg>
            <svg v-else-if="feature.icon === 'family'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <svg v-else-if="feature.icon === 'ticket'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 9a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3V9zM22 9a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3V9zM13.5 5.5v2M13.5 11v2M13.5 16.5v2M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
            </svg>
            <svg v-else-if="feature.icon === 'support'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            <span>{{ feature.text }}</span>
          </div>
        </div>
      </div>

      <!-- Right - Rating & Price -->
      <div class="flex flex-col items-end justify-between py-2 min-w-[180px]">
        <!-- Rating -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-0.5">
            <svg 
              v-for="i in 5" 
              :key="i"
              width="18" 
              height="18" 
              viewBox="0 0 24 24"
              :class="getStarClass(i, rating)"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="text-right">
            <div class="text-xs font-medium text-green-600">{{ ratingLabel }}</div>
            <div class="text-xs text-gray-400">{{ reviewCount }} reviews</div>
          </div>
          <div class="text-2xl font-bold text-orange-normal">
            {{ rating.toFixed(1) }}
          </div>
        </div>

        <!-- Price & Button -->
        <div class="text-right">
          <div class="text-lg font-bold text-gray-900 mb-3">
            {{ price }}
          </div>
          
          <!-- Booking Button - visible on hover -->
          <button 
            v-if="isHovered"
            class="px-8 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-sm"
          >
            BOOKING NOW
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
