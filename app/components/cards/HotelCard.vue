<script setup lang="ts">
import type { HotelList } from '~/types/hotel'

interface Props {
  hotel: HotelList
  featured?: boolean
}

defineProps<Props>()

// Badge colors based on category name
const getBadgeClass = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('luxury')) return 'bg-amber-500 text-white'
  if (name.includes('family')) return 'bg-blue-500 text-white'
  if (name.includes('boutique')) return 'bg-gray-800 text-white'
  if (name.includes('budget')) return 'bg-green-600 text-white'
  return 'bg-gray-700 text-white'
}
</script>

<template>
  <div class="group">
    <!-- Image Container -->
    <div 
      class="relative overflow-hidden rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
      :class="featured ? 'h-[280px] sm:h-[320px] md:h-[380px]' : 'h-[200px] sm:h-[240px] md:h-[260px]'"
    >
      <NuxtImg
        :src="hotel.image"
        :alt="hotel.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Category Badge -->
      <div class="absolute top-3 sm:top-4 left-3 sm:left-4">
        <span 
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
          :class="getBadgeClass(hotel.category.name)"
        >
          <!-- Star icon for luxury -->
          <svg 
            v-if="hotel.category.name.toLowerCase().includes('luxury')" 
            class="w-3 h-3" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ hotel.category.name }}
        </span>
      </div>
    </div>
    
    <!-- Content -->
    <div>
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
        {{ hotel.name }}
      </h3>
      <p 
        class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3"
        v-html="hotel.description"
      />
    </div>
  </div>
</template>
