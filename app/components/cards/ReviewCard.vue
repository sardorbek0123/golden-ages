<script setup lang="ts">
interface Props {
  name: string
  role: string
  avatar: string
  rating: number
  review: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm h-full">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <!-- Author Info -->
      <div class="flex items-center gap-3">
        <img
          :src="avatar"
          :alt="name"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 class="font-semibold text-gray-900">{{ name }}</h4>
          <p class="text-sm text-gray-500">{{ role }}</p>
        </div>
      </div>
      
      <!-- Quote Icon -->
      <div class="text-orange-normal">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6667 18.6667H6.66667C6.66667 12 10.6667 10.6667 10.6667 10.6667V14.6667C10.6667 14.6667 8 14.6667 8 18.6667H10.6667V25.3333H4V18.6667H10.6667ZM24 18.6667H20C20 12 24 10.6667 24 10.6667V14.6667C24 14.6667 21.3333 14.6667 21.3333 18.6667H24V25.3333H17.3333V18.6667H24Z" fill="currentColor"/>
        </svg>
      </div>
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
