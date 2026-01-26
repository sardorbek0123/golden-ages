<script setup lang="ts">
const citiesStore = useCitiesStore()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await citiesStore.fetchCityBySlug(slug.value)
})
</script>
<template>
  <div>
    <h1>City Page</h1>
  </div>
</template>