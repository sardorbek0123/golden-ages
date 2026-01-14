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
    class="bg-[#F9FAF9] hover:bg-[#FFF6E666] rounded-3xl p-4 border border-[#9195923D] hover:border-[#FFE4B0] transition-all duration-300 hover:shadow-lg block"
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

        <!-- Utilities -->
        <div v-if="utilities && utilities.length > 0" class="flex flex-wrap gap-2">
          <div 
            v-for="item in utilities" 
            :key="item.id"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F3F3F3] rounded-full text-xs text-gray-600"
          >
            <img 
              v-if="item.utility.icon" 
              :src="item.utility.icon" 
              :alt="item.utility.name"
              class="w-3.5 h-3.5 object-contain opacity-60"
            />
            <span>{{ item.value }}</span>
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
            @click.prevent=""
            class="px-8 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-sm"
          >
            BOOKING NOW
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
