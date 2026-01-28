<script setup lang="ts">
interface Props {
  title: string
  slug: string
  duration: string
  description: string
  price: string
  image: string
  isActive?: boolean
}

defineProps<Props>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div 
    class="tour-card relative overflow-hidden transition-all duration-500"
    :class="isActive ? 'tour-card--active' : 'tour-card--inactive'"
  >
    <!-- Image -->
    <div 
      class="relative transition-all duration-500" 
      :class="isActive ? 'h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px]' : 'h-[240px] sm:h-[320px] md:h-[400px] lg:h-[460px]'"
    >
      <NuxtImg
        :src="image"
        :alt="title"
        loading="lazy"
        class="w-full h-full object-cover rounded-xl sm:rounded-2xl"
      />
    </div>

    <!-- Content -->
    <div class="mt-3 sm:mt-4 lg:mt-5">
      <!-- Title - Always visible -->
      <NuxtLink 
        :to="localePath(`/tours/${slug}`)"
        class="font-bold text-gray-900 transition-all duration-300 line-clamp-2"
        :class="isActive ? 'text-base sm:text-lg lg:text-xl' : 'text-sm sm:text-base lg:text-lg'"
      >
        {{ title }}
      </NuxtLink>

      <!-- Active card extra content -->
      <template v-if="isActive">
        <!-- Duration -->
        <div class="flex items-center gap-2 mt-1.5 sm:mt-2">
          <span class="text-xs sm:text-sm text-orange-normal font-medium">{{ duration.split('/')[0] }}</span>
        </div>

        <!-- Description -->
        <p class="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 line-clamp-2">
          {{ description }}
        </p>

        <!-- Price and Button -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div class="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full">
            <span class="text-xs sm:text-sm font-medium text-gray-900">{{ price }}</span>
          </div>
          <NuxtLink :to="localePath('/#form')" class="inline-flex items-center justify-center px-4 sm:px-6 py-1.5 sm:py-2 bg-orange-normal text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
            {{ t('common.bookNow') }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tour-card--active {
  flex: 1.5;
}

.tour-card--inactive {
  flex: 1;
}
</style>
