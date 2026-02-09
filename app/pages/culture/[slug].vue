<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const blogStore = useBlogStore()
const { currentBlog, loadingDetail, error } = storeToRefs(blogStore)

const slug = computed(() => route.params.slug as string)

// Fetch blog on mount
onMounted(async () => {
  await blogStore.fetchBlogBySlug(slug.value)
})

// Watch for slug changes
watch(slug, async (newSlug) => {
  if (newSlug) {
    await blogStore.fetchBlogBySlug(newSlug)
  }
})

// Clean up on unmount
onUnmounted(() => {
  blogStore.clearCurrentBlog()
})

// SEO
useSeoMeta({
  title: () => currentBlog.value?.name || t('culture.heroTitle'),
  description: () => currentBlog.value?.description?.replace(/<[^>]*>/g, '').substring(0, 160) || ''
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loadingDetail" class="flex items-center justify-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-orange-normal border-t-transparent" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 sm:px-6 py-16 text-center">
      <p class="text-red-500 text-lg mb-4">{{ error }}</p>
      <NuxtLink
        to="/culture"
        class="inline-flex items-center text-orange-normal hover:text-orange-600 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('tourDetail.back') }}
      </NuxtLink>
    </div>

    <!-- Blog Content -->
    <article v-else-if="currentBlog" class="pb-16 sm:pb-20 lg:pb-24 relative">
      <!-- Back Button - positioned outside container -->
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-20 relative">
        <!-- Featured Image with back button -->
        <div class="relative mb-8 sm:mb-10 lg:mb-12">
          <!-- Back Button -->
          <NuxtLink
            to="/culture"
            class="absolute -left-2 sm:-left-4 lg:-left-16 xl:-left-24 top-4 sm:top-6 lg:top-8 inline-flex items-center text-grey-darker hover:text-dark-normal font-medium transition-colors z-10"
          >
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Featured Image -->
          <div v-if="currentBlog.image" class="rounded-2xl sm:rounded-3xl overflow-hidden">
            <NuxtImg
              :src="currentBlog.image"
              :alt="currentBlog.name"
              class="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
              loading="eager"
            />
          </div>
        </div>

        <!-- Category Badge -->
        <div v-if="currentBlog.category" class="mb-4">
          <span class="inline-block px-4 py-1.5 bg-orange-normal/10 text-orange-normal text-sm font-medium rounded-full">
            {{ currentBlog.category.name }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dark-normal leading-tight mb-6 sm:mb-8">
          {{ currentBlog.name }}
        </h1>

        <!-- Content -->
        <div
          class="prose prose-lg sm:prose-xl max-w-none
            prose-headings:text-dark-normal! prose-headings:font-bold
            prose-p:text-grey-darker! prose-p:leading-relaxed
            prose-a:text-orange-normal! prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:my-8
            prose-strong:text-dark-normal!
            prose-ul:text-grey-darker! prose-ol:text-grey-darker! text-grey-darker!"
          v-html="currentBlog.description"
        />
      </div>
    </article>

    <!-- Not Found -->
    <div v-else class="container mx-auto px-4 sm:px-6 py-16 text-center">
      <p class="text-grey-darker text-lg mb-4">{{ t('culture.postNotFound') }}</p>
      <NuxtLink
        to="/culture"
        class="inline-flex items-center text-orange-normal hover:text-orange-600 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('tourDetail.back') }}
      </NuxtLink>
    </div>
  </div>
</template>