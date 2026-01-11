<script setup lang="ts">
defineProps<{
  mobile?: boolean
}>()

const cities = [
  { name: 'Tashkent', href: '/cities/tashkent', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Samarkand', href: '/cities/samarkand', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Andijan', href: '/cities/andijan', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Jizzakh', href: '/cities/jizzakh', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Bukhara', href: '/cities/bukhara', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Kashkadarya', href: '/cities/kashkadarya', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Navoi', href: '/cities/navoi', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Surkhandarya', href: '/cities/surkhandarya', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Namangan', href: '/cities/namangan', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' },
  { name: 'Fergana', href: '/cities/fergana', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400' }
]
</script>

<template>
  <!-- Mobile View -->
  <div v-if="mobile" class="space-y-1">
    <NuxtLink
      v-for="city in cities"
      :key="city.name"
      :to="city.href"
      class="block py-2 px-3 text-grey-darker text-sm hover:bg-grey-light rounded-lg transition-colors"
    >
      {{ city.name }}
    </NuxtLink>
  </div>

  <!-- Desktop View -->
  <div v-else class="grid grid-cols-5 gap-4">
    <NuxtLink
      v-for="city in cities"
      :key="city.name"
      :to="city.href"
      class="group relative rounded-xl overflow-hidden h-[120px]"
    >
      <img
        :src="city.image"
        :alt="city.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div class="absolute bottom-3 left-3">
        <span class="text-white text-sm font-medium">{{ city.name }}</span>
      </div>
    </NuxtLink>
  </div>
</template>
