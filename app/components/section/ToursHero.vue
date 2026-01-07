<script setup lang="ts">
import heroImage from '~/assets/images/hero_bg.jpg'
const { t } = useI18n()
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4 pt-[140px]">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8 mt-16">
        <!-- Left - Title -->
        <div class="max-w-lg">
          <h1 class="text-5xl font-bold text-gray-900 leading-tight">
            {{ t('toursHero.title') }}
          </h1>
        </div>

        <!-- Right - Description & CTA -->
        <div class="max-w-md">
          <p class="text-gray-600 mb-6">
            {{ t('toursHero.description') }}
          </p>
          <button class="inline-flex items-center justify-center px-10 py-4 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide">
            {{ t('toursHero.cta') }}
          </button>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="rounded-3xl overflow-hidden">
        <img
          :src="heroImage"
          :alt="t('toursHero.alt')"
          class="w-full h-[500px] object-cover"
        />
      </div>
    </div>
  </section>
</template>
