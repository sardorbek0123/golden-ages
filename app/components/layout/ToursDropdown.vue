<script setup lang="ts">
defineProps<{
  mobile?: boolean
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const tripsStore = useTripsStore()
const { sortedTrips, loading } = storeToRefs(tripsStore)

// Default image fallback
const defaultImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'

// Fetch trips when component is mounted (dropdown opened)
onMounted(async () => {
  if (!tripsStore.hasTrips) {
    await tripsStore.fetchTrips({ limit: 4 })
  }
})

// Combined trips with "All" as first item (max 5 items total)
const displayItems = computed(() => {
  const allItem = {
    id: 0,
    name: t('tours.all'),
    slug: '/tours',
    image: defaultImage
  }

  const tripItems = sortedTrips.value
    .slice(0, 4) // Take only first 4 trips
    .map(trip => ({
      id: trip.id,
      name: trip.name,
      slug: `/tours/${trip.slug}`,
      image: trip.images?.[0]?.image || defaultImage
    }))

  return [allItem, ...tripItems]
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
      v-for="item in displayItems"
      :key="item.id"
      :to="localePath(item.slug)"
      class="block py-2 px-3 text-grey-darker text-sm hover:bg-grey-light rounded-lg transition-colors"
    >
      {{ item.name }}
    </NuxtLink>
  </div>

  <!-- Desktop View -->
  <div v-else class="grid grid-cols-5 gap-4">
    <NuxtLink
      v-for="item in displayItems"
      :key="item.id"
      :to="localePath(item.slug)"
      class="group relative rounded-xl overflow-hidden h-[140px]"
    >
      <NuxtImg
        :src="item.image"
        :alt="item.name"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div class="absolute bottom-3 left-3 right-3">
        <div class="flex items-center justify-between">
          <span class="text-white text-sm font-medium">{{ item.name }}</span>
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
