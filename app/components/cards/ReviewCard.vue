<script setup lang="ts">
interface Props {
  name: string
  role: string
  avatar?: string | null
  rating: number
  review: string
}

const props = defineProps<Props>()

const avatarUrl = computed(() => {
  return props.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(props.name)}&background=F97316&color=fff`
})
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm h-full">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <!-- Author Info -->
      <div class="flex items-center gap-3">
        <NuxtImg
          :src="avatarUrl"
          :alt="name"
          loading="lazy"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 class="font-semibold text-gray-900">{{ name }}</h4>
          <p class="text-sm text-gray-500">{{ role }}</p>
        </div>
      </div>
      
      <!-- Quote Icon -->
      <IconsQuote />
    </div>

    <!-- Stars -->
    <div class="flex items-center gap-1 mb-4">
      <svg
        v-for="i in 5"
        :key="i"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="i <= rating ? 'text-orange-normal' : 'text-gray-300'"
      >
        <path
          d="M10 1.66667L12.575 6.88334L18.3333 7.72501L14.1667 11.7833L15.15 17.5167L10 14.8083L4.85 17.5167L5.83333 11.7833L1.66667 7.72501L7.425 6.88334L10 1.66667Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <!-- Review Text -->
    <p class="text-gray-600 text-sm leading-relaxed italic">
      {{ review }}
    </p>
  </div>
</template>
