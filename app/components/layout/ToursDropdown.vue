<script setup lang="ts">
const tourCategories = [
  {
    name: 'Group Tours',
    href: '/tours?category=group',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400'
  },
  {
    name: 'Family Package',
    href: '/tours?category=family',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400'
  },
  {
    name: 'Business Package',
    href: '/tours?category=business',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400'
  },
  {
    name: 'Personal Tours',
    href: '/tours?category=personal',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400'
  },
  {
    name: 'Day Tours',
    href: '/tours?category=day',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400'
  }
]
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <NuxtLink
      v-for="tour in tourCategories"
      :key="tour.name"
      :to="tour.href"
      class="group relative rounded-xl overflow-hidden h-[140px]"
    >
      <img
        :src="tour.image"
        :alt="tour.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div class="absolute bottom-3 left-3 right-3">
        <div class="flex items-center justify-between">
          <span class="text-white text-sm font-medium">{{ tour.name }}</span>
          <svg 
            class="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
