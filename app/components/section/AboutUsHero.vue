<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="relative bg-cover bg-center h-screen">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-[url('@/assets/images/hero_bg.jpg')] bg-cover bg-center"></div>
    
    <!-- Dark Overlay (70% black) -->
    <div class="absolute inset-0 bg-black/70"></div>
    
    <!-- Content -->
    <div class="relative container mx-auto h-full">
      <div class="flex flex-col items-center justify-center gap-4 h-full">
        <h1 class="text-4xl md:text-6xl lg:text-9xl font-medium text-white text-center">
            {{ t('hero.title') }}
        </h1>
        <p class="text-lg md:text-2xl text-white text-center max-w-[800px]">
            {{ t('hero.subtitle') }}
        </p>
      </div>
    </div>
  </section>
</template>