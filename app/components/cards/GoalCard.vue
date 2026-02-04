<script setup lang="ts">
interface Props {
  badge: string
  value: string
  description: string
  image?: string
}

defineProps<Props>()
</script>

<template>
  <div 
    class="relative rounded-2xl overflow-hidden p-5 sm:p-6"
    :class="image ? 'min-h-[200px] sm:min-h-[220px]' : 'bg-white'"
  >
    <!-- Background image if provided -->
    <template v-if="image">
      <div class="absolute inset-0">
        <NuxtImg 
          :src="image" 
          alt="" 
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/40" />
      </div>
      
      <!-- Content with image -->
      <div class="relative z-10 h-full flex flex-col">
        <span class="inline-flex self-start px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wide rounded-full mb-auto">
          {{ badge }}
        </span>
        <div class="mt-auto">
          <h3 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ value }}
          </h3>
          <p class="text-sm text-white/80 leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
    </template>
    
    <!-- Content without image -->
    <template v-else>
      <span class="inline-flex px-3 py-1 border border-gray-300 text-gray-600 text-xs font-medium uppercase tracking-wide rounded-full mb-4">
        {{ badge }}
      </span>
      <h3 class="text-2xl sm:text-3xl font-bold text-orange-normal mb-2">
        {{ value }}
      </h3>
      <p class="text-sm text-gray-500 leading-relaxed">
        {{ description }}
      </p>
    </template>
  </div>
</template>
