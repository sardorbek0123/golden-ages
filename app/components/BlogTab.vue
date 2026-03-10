<script setup lang="ts">
const { t } = useI18n()
const blogStore = useBlogStore()
const { blogs, loading, loadingMore, hasMore } = storeToRefs(blogStore)
const localePath = useLocalePath()

const activeCategory = ref<number>(0)

const toggleCategory = (categoryId: number) => {
  activeCategory.value = categoryId
}

const categories = computed(() => {
  const allCategory = {
    id: 0,
    name: t('all'),
  }
  const apiCategories = blogStore.blogCategories.map(category => ({
    id: category.id,
    name: category.name
  }))

  return [allCategory, ...apiCategories]
})

const filteredBlogs = computed(() => {
  return blogStore.blogsByCategory(activeCategory.value)
})

// Get featured blog (first one or one marked as new)
const featuredBlog = computed(() => {
  const newBlog = filteredBlogs.value.find(blog => blog.is_new)
  return newBlog || filteredBlogs.value[0]
})

// Get remaining blogs for grid
const gridBlogs = computed(() => {
  if (!featuredBlog.value) return filteredBlogs.value
  return filteredBlogs.value.filter(blog => blog.id !== featuredBlog.value?.id)
})
</script>

<template>
  <div>
    <!-- Category Tabs -->
    <div class="flex justify-center mb-8 sm:mb-10 lg:mb-12">
      <div class="flex flex-wrap justify-center items-center gap-4 sm:gap-6 border-b border-grey-normal w-fit">
        <button
          v-for="category in categories"
          :key="category.id"
          class="font-semibold text-base sm:text-lg lg:text-xl pb-3 border-b-2 transition-all duration-300"
          :class="activeCategory === category.id
            ? 'text-dark-normal border-dark-normal'
            : 'text-grey-darker border-transparent hover:text-dark-normal'"
          @click="toggleCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-normal border-t-transparent" />
    </div>

    <!-- Blog Grid -->
    <div v-else-if="filteredBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      <!-- Featured Large Card (2 cols × 2 rows, overlay style) -->
      <NuxtLink
        v-if="featuredBlog"
        :to="localePath(`/culture/${featuredBlog.slug}`)"
        class="group relative md:col-span-1 lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden aspect-4/5 lg:aspect-auto lg:h-full min-h-[300px] sm:min-h-[400px]"
      >
        <NuxtImg
          v-if="featuredBlog.image"
          :src="featuredBlog.image"
          :alt="featuredBlog.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div
          v-if="featuredBlog.is_new"
          class="absolute top-4 left-4 bg-cyan-400 text-dark-normal text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
        >
          NEW
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h3 class="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-2">
            {{ featuredBlog.name }}
          </h3>
          <p class="text-white/80 text-sm sm:text-base line-clamp-2 hidden sm:block">
            {{ featuredBlog.description?.replace(/<[^>]*>/g, '').substring(0, 120) }}
          </p>
        </div>
      </NuxtLink>

      <!-- Wide card (top-right, 2 cols × 1 row) -->
      <NuxtLink
        v-if="gridBlogs[0]"
        :to="localePath(`/culture/${gridBlogs[0].slug}`)"
        class="group lg:col-span-2 rounded-2xl overflow-hidden"
      >
        <div class="overflow-hidden rounded-2xl aspect-video">
          <NuxtImg
            v-if="gridBlogs[0].image"
            :src="gridBlogs[0].image"
            :alt="gridBlogs[0].name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div class="pt-3 sm:pt-4">
          <h3 class="text-dark-normal text-base sm:text-lg font-bold leading-tight mb-1 line-clamp-2">
            {{ gridBlogs[0].name }}
          </h3>
          <p class="text-grey-darker text-xs sm:text-sm line-clamp-2">
            {{ gridBlogs[0].description?.replace(/<[^>]*>/g, '').substring(0, 100) }}
          </p>
        </div>
      </NuxtLink>

      <!-- Two normal cards completing rows 1-2 -->
      <NuxtLink
        v-for="blog in gridBlogs.slice(1, 3)"
        :key="blog.id"
        :to="localePath(`/culture/${blog.slug}`)"
        class="group rounded-2xl overflow-hidden"
      >
        <div class="overflow-hidden rounded-2xl aspect-square">
          <NuxtImg
            v-if="blog.image"
            :src="blog.image"
            :alt="blog.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div class="pt-3 sm:pt-4">
          <h3 class="text-dark-normal text-sm sm:text-base font-bold leading-tight mb-1 line-clamp-2">
            {{ blog.name }}
          </h3>
          <p v-html="blog.description?.replace(/<[^>]*>/g, '').substring(0, 80)" class="text-grey-darker text-xs sm:text-sm line-clamp-2">
          </p>
        </div>
      </NuxtLink>

      <!-- Remaining cards in rows of 4 -->
      <NuxtLink
        v-for="blog in gridBlogs.slice(3)"
        :key="`rest-${blog.id}`"
        :to="localePath(`/culture/${blog.slug}`)"
        class="group rounded-2xl overflow-hidden"
      >
        <div class="overflow-hidden rounded-2xl aspect-square">
          <NuxtImg
            v-if="blog.image"
            :src="blog.image"
            :alt="blog.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div class="pt-3 sm:pt-4">
          <h3 class="text-dark-normal text-sm sm:text-base font-bold leading-tight mb-1 line-clamp-2">
            {{ blog.name }}
          </h3>
          <p v-html="blog.description?.replace(/<[^>]*>/g, '').substring(0, 80)" class="text-grey-darker text-xs sm:text-sm line-clamp-2">
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <p class="text-grey-darker text-lg">{{ t('culture.noPosts') }}</p>
    </div>

    <!-- View More Button -->
    <div v-if="filteredBlogs.length > 0 && hasMore" class="flex justify-center mt-8 sm:mt-10 lg:mt-12">
      <button
        :disabled="loadingMore"
        class="px-8 py-3 border border-grey-normal rounded-full text-dark-normal font-medium hover:bg-grey-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="blogStore.loadMoreBlogs()"
      >
        <span v-if="loadingMore" class="flex items-center gap-2">
          <span class="animate-spin rounded-full h-4 w-4 border-2 border-dark-normal border-t-transparent" />
          {{ t('culture.viewMore') }}
        </span>
        <span v-else>{{ t('culture.viewMore') }}</span>
      </button>
    </div>
  </div>
</template>
