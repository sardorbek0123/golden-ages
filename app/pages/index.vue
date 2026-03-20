<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: 'Golden Ages of Uzbekistan | Silk Road Tours & Private Travel',
  description: t('hero.subtitle'),
  ogTitle: 'Golden Ages of Uzbekistan | Silk Road Tours & Private Travel',
  ogDescription: t('hero.subtitle'),
  ogType: 'website'
})
</script>

<template>
  <div>
    <SectionHero />
    <SectionWhyChooseUs />
    <SectionDestinations />
    <LazySectionTestimonials />
    <LazySectionMainTourPackages />
    <SectionContactForm id="form"/>
  </div>
</template>
