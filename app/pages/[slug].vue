<script setup lang="ts">
import { useStaticPagesStore } from '~/stores/staticPages'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const staticPagesStore = useStaticPagesStore()
const { t } = useI18n()
const localePath = useLocalePath()

onMounted(async () => {
  await staticPagesStore.fetchPage(slug.value)
})

// Watch for slug changes
watch(slug, async (newSlug) => {
  await staticPagesStore.fetchPage(newSlug)
})

// Cleanup on unmount
onUnmounted(() => {
  staticPagesStore.clearError()
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-8 md:py-16 lg:py-26">
    <div v-if="staticPagesStore.loading">
      <div class="animate-pulse mt-12 sm:mt-16">
        <div class="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4" />
        <div class="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-1/2 mb-6 sm:mb-8" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2 h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 rounded-xl sm:rounded-2xl" />
          <div class="space-y-4">
            <div class="h-40 sm:h-48 md:h-60 bg-gray-200 rounded-xl sm:rounded-2xl" />
            <div class="h-40 sm:h-48 md:h-60 bg-gray-200 rounded-xl sm:rounded-2xl" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="staticPagesStore.page" v-html="staticPagesStore.page?.content"
      class="prose prose-lg sm:prose-xl max-w-none
            prose-headings:text-dark-normal! prose-headings:font-bold
            prose-p:text-grey-darker! prose-p:leading-relaxed
            prose-a:text-orange-normal! prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:my-8
            prose-strong:text-dark-normal!
            prose-ul:text-grey-darker! prose-ol:text-grey-darker! text-grey-darker!"
      ></div>

    <div v-else class="text-center py-8 sm:py-10 mt-12 sm:mt-16">
      <p class="text-sm sm:text-base text-red-500 mb-4">{{ t('error.pageNotFound') }}</p>
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center text-orange-normal hover:text-orange-600 font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('common.backToHome') }}
      </NuxtLink>
    </div>
  </div>
  <div v-if="staticPagesStore.error" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div class="text-center py-8 sm:py-10 mt-12 sm:mt-16">
      <p class="text-sm sm:text-base text-red-500 mb-4">{{ staticPagesStore.error }}</p>
      <button
        class="px-5 sm:px-6 py-2 bg-orange-normal text-white text-sm sm:text-base rounded-full hover:bg-orange-normal-hover transition-colors"
        @click="staticPagesStore.fetchPage(slug)">
        {{ t('common.try_again') }}
      </button>
    </div>
  </div>
</template>
