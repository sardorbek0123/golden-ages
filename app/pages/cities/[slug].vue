<script setup lang="ts">
const citiesStore = useCitiesStore()
const { currentCity } = storeToRefs(citiesStore)
const route = useRoute()
const { t, locale } = useI18n()

const slug = computed(() => route.params.slug as string)

const { status } = await useAsyncData(
  `city-${slug.value}`,
  () => citiesStore.fetchCityBySlug(slug.value),
  { watch: [slug, locale] }
)

useSeoMeta({
  title: () => currentCity.value?.name ? `${currentCity.value.name} Hotels & Travel Guide | Golden Ages` : t('cities.all'),
  description: () => currentCity.value?.location || t('hotels.description', { city: currentCity.value?.name || '' })
})
</script>

<template>
  <main class="pt-10 sm:pt-14 md:pt-16 lg:pt-20">
    <!-- Loading State -->
    <div v-if="status === 'pending'" class="min-h-[50vh] flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-orange-normal border-t-transparent" />
    </div>

    <template v-else-if="currentCity">
      <!-- Famous Places Section -->
      <SectionCityFamousPlaces :city-id="currentCity.id" />

      <!-- City Overview Section -->
      <SectionCityOverview :city="currentCity" />

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
