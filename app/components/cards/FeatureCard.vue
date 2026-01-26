<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-2xl p-3 sm:p-6 border border-[#9195923D] hover:shadow-md transition-all duration-100">
    <div class="flex flex-col gap-3 sm:gap-4">
      <!-- Icon -->
      <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-orange-normal flex items-center justify-center shrink-0">
        <component :is="icon" class="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      
      <!-- Content -->
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
