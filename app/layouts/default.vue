<script setup lang="ts">
const localeHead = useLocaleHead()

const { public: { siteUrl } } = useRuntimeConfig()

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Golden Ages of Uzbekistan',
  url: siteUrl,
  areaServed: 'Uzbekistan',
  availableLanguage: ['en', 'ru', 'uz', 'es', 'de', 'fr', 'it']
}

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  meta: localeHead.value.meta,
  link: localeHead.value.link,
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(organizationSchema)
    }
  ]
}))
</script>

<template>
  <div class="relative bg-[#F0F0F0]">
    <LayoutHeader />
    <main>
      <slot />
    </main>
    <LayoutFooter />
    <LayoutWhatsAppFab />
  </div>
</template>
