<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const handleError = () => {
  clearError({ redirect: '/' })
}

const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-4">
    <div class="text-center max-w-2xl">
      <!-- Title -->
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        <template v-if="is404">
          {{ t('error.pageNotFound') }}
        </template>
        <template v-else>
          {{ t('error.somethingWentWrong') }}
        </template>
      </h1>

      <!-- Description -->
      <p class="text-gray-500 text-base leading-relaxed mb-8 max-w-lg mx-auto">
        <template v-if="is404">
          {{ t('error.pageNotFoundDescription') }}
        </template>
        <template v-else>
          {{ t('error.somethingWentWrongDescription') }}
        </template>
      </p>

      <!-- Button -->
      <button
        class="px-10 py-3 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide text-sm"
        @click="handleError"
      >
        {{ t('error.backToHome') }}
      </button>
    </div>
  </div>
</template>

