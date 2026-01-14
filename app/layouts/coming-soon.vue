<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="relative bg-[#F0F0F0]">
    <LayoutHeader />
    
    <main>
      <!-- Coming Soon Section -->
      <section class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div class="text-center max-w-2xl">
          <!-- Title -->
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {{ t('comingSoon.title') }}
          </h1>

          <!-- Description -->
          <p class="text-gray-500 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            {{ t('comingSoon.description') }}
          </p>

          <!-- Button -->
          <NuxtLink
            to="/"
            class="inline-block px-10 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-sm"
          >
            {{ t('comingSoon.backToHome') }}
          </NuxtLink>
        </div>
      </section>
    </main>
    
    <LayoutFooter />
  </div>
</template>
