<script setup lang="ts">
const { t } = useI18n()
const blogStore = useBlogStore()

onMounted(async () => {
  await blogStore.fetchBlogCategories()
  await blogStore.fetchBlogs()
})
</script>
<template>
  <section class="container mx-auto py-2 sm:py-4 md:py-6 lg:py-8 xl:py-10 px-4 sm:px-6">
    <BlogTab />
  </section>
</template>