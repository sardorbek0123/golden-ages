<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import heroBg from '~/assets/images/hero_bg.jpg'

const { t } = useI18n()
const localePath = useLocalePath()

const heroBgStyle = { backgroundImage: `url(${heroBg})` }

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: heroBg
    }
  ]
})
</script>

<template>
  <section
    class="relative isolate flex min-h-svh flex-col bg-cover bg-center bg-no-repeat md:h-screen"
    :style="heroBgStyle"
  >
    <!-- Затемнение поверх фона -->
    <div class="pointer-events-none absolute inset-0 z-0 bg-black/70" aria-hidden="true" />

    <!-- Контент выше оверлея -->
    <div class="relative z-10 flex min-h-svh flex-1 flex-col md:h-screen">
      <div class="container mx-auto flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4 py-40 sm:py-20 md:py-0"
        >
          <h1
            class="text-center text-3xl font-medium leading-tight text-white sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl"
          >
            {{ t('hero.title') }}
          </h1>
          <p
            class="max-w-[90%] text-center text-base text-white sm:max-w-[600px] sm:text-lg md:max-w-[700px] md:text-xl lg:max-w-[800px] lg:text-2xl"
          >
            {{ t('hero.subtitle') }}
          </p>
          <div
            class="mt-4 flex w-full flex-col items-center gap-3 sm:mt-5 sm:w-auto sm:flex-row sm:gap-4"
          >
            <NuxtLink
              :to="localePath('/tours')"
              class="w-full rounded-full border border-gray-50 bg-transparent px-5 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-orange-normal sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
            >
              {{ t('hero.exploreTours') }}
            </NuxtLink>
            <NuxtLink
              to="#form"
              class="w-full rounded-full bg-orange-normal px-5 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-orange-400 sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
            >
              {{ t('hero.ctaText') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
