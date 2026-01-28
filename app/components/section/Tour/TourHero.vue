<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import heroImage from '~/assets/images/hero_bg.jpg'
const { t } = useI18n()
</script>

<template>
  <section class="py-8 sm:py-12 md:py-16">
    <div class="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 lg:pt-[140px]">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 mb-6 sm:mb-8 mt-8 sm:mt-12 md:mt-16">
        <!-- Left - Title -->
        <div class="max-w-lg">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {{ t('toursPage.heroTitle') }}
          </h1>
        </div>

        <!-- Right - Description & CTA -->
        <div class="max-w-md">
          <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {{ t('toursPage.heroSubtitle') }}
          </p>
          <NuxtLink to="#form" class="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-orange-normal text-white text-sm sm:text-base font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
            {{ t('toursPage.startTrip') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
        <NuxtImg
          :src="heroImage"
          :alt="t('toursPage.heroTitle')"
          class="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
