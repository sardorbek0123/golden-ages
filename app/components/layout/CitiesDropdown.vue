<script setup lang="ts">
defineProps<{
  mobile?: boolean
}>()

const { t } = useI18n()
const citiesStore = useCitiesStore()
const { sortedCities, loading } = storeToRefs(citiesStore)

// Fetch cities on mount
onMounted(async () => {
  if (!citiesStore.hasCities) {
    await citiesStore.fetchCities()
  }
})

// Default image fallback
const defaultImage = 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400'

// Combined cities with "All" as first item
const displayCities = computed(() => {
  const allCity = {
    id: 0,
    name: t('cities.all'),
    slug: '',
    href: '/cities',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
  }
  
  const apiCities = sortedCities.value.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    href: `/cities/${city.slug}`,
    image: city.image || defaultImage
  }))
  
  return [allCity, ...apiCities]
})
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-2 border-orange-normal border-t-transparent" />
  </div>

  <!-- Mobile View -->
  <div v-else-if="mobile" class="space-y-1">
    <NuxtLink
      v-for="city in displayCities"
      :key="city.id"
      :to="city.href"
      class="block py-2 px-3 text-grey-darker text-sm hover:bg-grey-light rounded-lg transition-colors"
    >
      {{ city.name }}
    </NuxtLink>
  </div>

  <!-- Desktop View -->
  <div v-else class="grid grid-cols-5 gap-4">
    <NuxtLink
      v-for="city in displayCities"
      :key="city.id"
      :to="city.href"
      class="group relative rounded-xl overflow-hidden h-[120px]"
    >
      <NuxtImg
        :src="city.image"
        :alt="city.name"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div class="absolute bottom-3 left-3">
        <span class="text-white text-sm font-medium">{{ city.name }}</span>
      </div>
    </NuxtLink>
  </div>
</template>
