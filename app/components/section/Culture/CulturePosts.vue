<script setup lang="ts">
const { t } = useI18n()
const blogStore = useBlogStore()

onMounted(async () => {
  blogStore.blogCategories = await blogStore.fetchBlogCategories()
  await blogStore.fetchBlogs()
})
</script>
<template>
  <section class="container mx-auto py-10 sm:py-14 md:py-16 lg:py-20 xl:py-30 px-4 sm:px-6">
    <BlogTab />
    
  </section>
</template>