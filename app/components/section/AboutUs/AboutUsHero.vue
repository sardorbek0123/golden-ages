<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="relative bg-cover bg-center min-h-svh md:h-screen">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-[url('@/assets/images/hero_bg.jpg')] bg-cover bg-center"></div>
    
    <!-- Dark Overlay (70% black) -->
    <div class="absolute inset-0 bg-black/70"></div>
    
    <!-- Content -->
    <div class="relative container mx-auto h-full px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-center gap-3 sm:gap-4 h-full py-40 sm:py-20 md:py-0">
        <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-medium text-white text-center leading-tight">
            {{ t('hero.title') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
            {{ t('hero.subtitle') }}
        </p>
        <div class="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <NuxtLink :to="localePath('/tours')" class="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 sm:py-2 bg-transparent text-white text-xs sm:text-sm font-semibold border border-gray-50 hover:border-orange-normal rounded-full transition-colors uppercase tracking-wide">
            {{ t('hero.exploreTours') }}
          </NuxtLink>
          <NuxtLink to="#form" class="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 sm:py-2 bg-orange-normal hover:bg-orange-400 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors uppercase tracking-wide">
            {{ t('hero.ctaText') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>