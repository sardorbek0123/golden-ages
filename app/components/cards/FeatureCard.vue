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
  <div class="bg-white rounded-2xl p-6 border border-[#9195923D] hover:shadow-md transition-all duration-100">
    <div class="flex flex-col gap-4">
      <!-- Icon -->
      <div class="w-14 h-14 rounded-full bg-[#ffa800] flex items-center justify-center flex-shrink-0">
        <component :is="icon" />
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
