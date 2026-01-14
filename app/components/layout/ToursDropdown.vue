<script setup lang="ts">
defineProps<{
  mobile?: boolean
}>()

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const { sortedCategories, loading } = storeToRefs(categoriesStore)

// Fetch categories on mount
onMounted(async () => {
  if (!categoriesStore.hasCategories) {
    await categoriesStore.fetchCategories()
  }
})

// Default image fallback
const defaultImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'

// Combined categories with "All" as first item
const displayCategories = computed(() => {
  const allCategory = {
    id: 0,
    name: t('tours.all'),
    slug: '/tours',
    image: defaultImage
  }
  
  const apiCategories = sortedCategories.value.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug ? `/tours/${cat.slug}` : `/tours`,
    image: cat?.image || defaultImage
  }))
  
  return [allCategory, ...apiCategories]
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
      v-for="category in displayCategories"
      :key="category.id"
      :to="category.slug"
      class="block py-2 px-3 text-grey-darker text-sm hover:bg-grey-light rounded-lg transition-colors"
    >
      {{ category.name }}
    </NuxtLink>
  </div>

  <!-- Desktop View -->
  <div v-else class="grid grid-cols-6 gap-4">
    <NuxtLink
      v-for="category in displayCategories"
      :key="category.id"
      :to="category.slug"
      class="group relative rounded-xl overflow-hidden h-[140px]"
    >
      <img
        :src="category.image"
        :alt="category.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div class="absolute bottom-3 left-3 right-3">
        <div class="flex items-center justify-between">
          <span class="text-white text-sm font-medium">{{ category.name }}</span>
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
