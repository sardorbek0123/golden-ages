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
</script>

<template>
  <div 
    class="tour-card relative overflow-hidden transition-all duration-500"
    :class="isActive ? 'tour-card--active' : 'tour-card--inactive'"
  >
    <!-- Image -->
    <div class="relative" :class="isActive ? 'h-[600px]' : 'h-[460px]'">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover rounded-2xl"
      />
    </div>

    <!-- Content -->
    <div class="mt-5">
      <!-- Title - Always visible -->
      <NuxtLink 
        :to="`/tours/${slug}`"
        class="font-bold text-gray-900 transition-all duration-300"
        :class="isActive ? 'text-xl' : 'text-lg'"
      >
        {{ title }}
      </NuxtLink>

      <!-- Active card extra content -->
      <template v-if="isActive">
        <!-- Duration -->
        <div class="flex items-center gap-2 mt-2">
          <span class="text-sm text-orange-normal font-medium">{{ duration.split('/')[0] }}</span>
          <!-- <span class="text-sm text-gray-500">/ {{ duration.split('/')[1] }}</span> -->
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-500 mt-3 line-clamp-2">
          {{ description }}
        </p>

        <!-- Price and Button -->
        <div class="flex items-center justify-between mt-4">
          <div class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full">
            <span class="text-sm font-medium text-gray-900">{{ price }}</span>
          </div>
          <NuxtLink to="#form" class="inline-flex items-center justify-center px-6 py-2 bg-orange-normal text-white text-sm font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
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
