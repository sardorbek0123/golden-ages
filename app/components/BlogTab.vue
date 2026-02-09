<script setup lang="ts">
const { t } = useI18n()
const blogStore = useBlogStore()
const { blogs, loading } = storeToRefs(blogStore)
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
      <!-- Featured Large Card (spans 2 rows on left) -->
      <NuxtLink
        v-if="featuredBlog"
        :to="localePath(`/culture/${featuredBlog.slug}`)"
        class="group relative md:col-span-1 lg:col-span-2 lg:row-span-2 rounded-xl sm:rounded-2xl overflow-hidden aspect-4/5 lg:aspect-auto lg:h-full min-h-[300px] sm:min-h-[400px]"
      >
        <NuxtImg
          v-if="featuredBlog.image"
          :src="featuredBlog.image"
          :alt="featuredBlog.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        
        <!-- NEW Badge -->
        <div
          v-if="featuredBlog.is_new"
          class="absolute top-4 left-4 bg-cyan-400 text-dark-normal text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
        >
          NEW
        </div>
        
        <!-- Content -->
        <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h3 class="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-2">
            {{ featuredBlog.name }}
          </h3>
          <p class="text-white/80 text-sm sm:text-base line-clamp-2 hidden sm:block">
            {{ featuredBlog.description?.replace(/<[^>]*>/g, '').substring(0, 120) }}...
          </p>
        </div>
      </NuxtLink>

      <!-- Right Column Cards -->
      <template v-for="(blog, index) in gridBlogs" :key="blog.id">
        <!-- First row right cards (index 0, 1) - Square cards -->
        <NuxtLink
          v-if="index < 2"
          :to="localePath(`/culture/${blog.slug}`)"
          class="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square"
        >
          <NuxtImg
            v-if="blog.image"
            :src="blog.image"
            :alt="blog.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          
          <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 class="text-white text-sm sm:text-base lg:text-lg font-semibold leading-tight line-clamp-2">
              {{ blog.name }}
            </h3>
          </div>
        </NuxtLink>

        <!-- Second row cards (index 2, 3) - With description -->
        <NuxtLink
          v-else-if="index < 4"
          :to="localePath(`/culture/${blog.slug}`)"
          class="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square"
        >
          <NuxtImg
            v-if="blog.image"
            :src="blog.image"
            :alt="blog.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          
          <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 class="text-white text-sm sm:text-base font-semibold leading-tight mb-1">
              {{ blog.name }}
            </h3>
            <p class="text-white/70 text-xs sm:text-sm line-clamp-2 hidden sm:block">
              {{ blog.description?.replace(/<[^>]*>/g, '').substring(0, 80) }}...
            </p>
          </div>
        </NuxtLink>
      </template>

      <!-- Bottom Row - 4 equal cards -->
      <NuxtLink
        v-for="blog in gridBlogs.slice(4, 8)"
        :key="`bottom-${blog.id}`"
        :to="localePath(`/culture/${blog.slug}`)"
        class="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-4/5"
      >
        <NuxtImg
          v-if="blog.image"
          :src="blog.image"
          :alt="blog.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        
        <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 class="text-white text-sm sm:text-base font-semibold leading-tight mb-1">
            {{ blog.name }}
          </h3>
          <p class="text-white/70 text-xs sm:text-sm line-clamp-2 hidden sm:block">
            {{ blog.description?.replace(/<[^>]*>/g, '').substring(0, 80) }}...
          </p>
        </div>
      </NuxtLink>

      <!-- Additional Row - 4 equal cards -->
      <NuxtLink
        v-for="blog in gridBlogs.slice(8, 12)"
        :key="`extra-${blog.id}`"
        :to="localePath(`/culture/${blog.slug}`)"
        class="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-4/5"
      >
        <NuxtImg
          v-if="blog.image"
          :src="blog.image"
          :alt="blog.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        
        <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 class="text-white text-sm sm:text-base font-semibold leading-tight mb-1">
            {{ blog.name }}
          </h3>
          <p class="text-white/70 text-xs sm:text-sm line-clamp-2 hidden sm:block">
            {{ blog.description?.replace(/<[^>]*>/g, '').substring(0, 80) }}...
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <p class="text-grey-darker text-lg">{{ t('culture.noPosts') }}</p>
    </div>

    <!-- View All Button -->
    <div v-if="filteredBlogs.length > 0" class="flex justify-center mt-8 sm:mt-10 lg:mt-12">
      <button
        class="px-8 py-3 border border-grey-normal rounded-full text-dark-normal font-medium hover:bg-grey-light transition-colors duration-300"
      >
        {{ t('culture.viewAll') }}
      </button>
    </div>
  </div>
</template>
