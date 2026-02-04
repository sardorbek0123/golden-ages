<script setup lang="ts">
const citiesStore = useCitiesStore()
const { currentCity, loadingDetail } = storeToRefs(citiesStore)
const route = useRoute()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await citiesStore.fetchCityBySlug(slug.value)
})

// Watch for slug changes
watch(slug, async (newSlug) => {
  if (newSlug) {
    await citiesStore.fetchCityBySlug(newSlug)
  }
})
</script>

<template>
  <main class="pt-10 sm:pt-14 md:pt-16 lg:pt-20">
    <!-- Loading State -->
    <div v-if="loadingDetail" class="min-h-[50vh] flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-orange-normal border-t-transparent" />
    </div>
    
    <template v-else-if="currentCity">
      <!-- Hotels Section -->
      <SectionCityHotelsSection 
        :city-id="currentCity.id" 
        :city-name="currentCity.name" 
      />
      
      <SectionTestimonials />
      <SectionContactForm id="form"/>
    </template>
  </main>
</template>