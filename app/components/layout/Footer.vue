<script setup lang="ts">
import footerBg from '~/assets/images/footer.png'

const { t } = useI18n()
const localePath = useLocalePath()
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

onMounted(async () => {
  if (!settings.value) {
    await settingsStore.fetchSettings()
  }
})

const footerLinks = {
  tours: {
    title: t('footer.tours.title'),
    links: [
      { name: t('footer.tours.all'), href: '/tours' },
      // { name: t('footer.tours.familyPackages'), href: '#' },
      // { name: t('footer.tours.businessTours'), href: '#' },
      // { name: t('footer.tours.individualTrips'), href: '#' },
      // { name: t('footer.tours.friendsGetaways'), href: '#' },
      // { name: t('footer.tours.vipExperiences'), href: '#' }
    ]
  },
  aboutUs: {
    title: t('footer.aboutUs.title'),
    links: [
      { name: t('footer.aboutUs.missions'), href: '/about#missions' },
      // { name: t('footer.aboutUs.goals'), href: '#' },
      // { name: t('footer.aboutUs.license'), href: '#' },
      { name: t('footer.aboutUs.teamMembers'), href: '/about#team' }
    ]
  },
  // cities: {
  //   title: t('footer.cities.title'),
  //   links: [
  //     { name: t('footer.cities.tashkent'), href: '#' },
  //     { name: t('footer.cities.samarkand'), href: '#' },
  //     { name: t('footer.cities.bukhara'), href: '#' },
  //     { name: t('footer.cities.khiva'), href: '#' },
  //     { name: t('footer.cities.more'), href: '#' }
  //   ]
  // },
  // culture: {
  //   title: t('footer.culture.title'),
  //   links: [
  //     { name: t('footer.culture.cuisineFood'), href: '#' },
  //     { name: t('footer.culture.artHandicrafts'), href: '#' },
  //     { name: t('footer.culture.musicFestivals'), href: '#' },
  //     { name: t('footer.culture.historyHeritageStories'), href: '#' }
  //   ]
  // }
}

const socialLinks = computed(() => {
  if (!settings.value) return []

  return [
    { name: 'Facebook', icon: 'facebook', href: settings.value.facebook },
    { name: 'Instagram', icon: 'instagram', href: settings.value.instagram },
    { name: 'X', icon: 'x', href: settings.value.twitter },
    { name: 'LinkedIn', icon: 'linkedin', href: settings.value.linkedin },
    { name: 'Telegram', icon: 'telegram', href: settings.value.telegram },
    { name: 'WhatsApp', icon: 'whatsapp', href: settings.value.whatsapp }
  ].filter((social) => social.href)
})
</script>

<template>
  <footer class="bg-black text-white relative">
    <!-- Main Footer Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-14 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-8">
        <!-- Logo & Description -->
        <div class="md:col-span-4 lg:col-span-3">
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <IconsLogo class="h-8 sm:h-10 w-auto" />
          </div>

          <p class="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed max-w-xs">
            {{ t('footer.description') }}
          </p>

          <!-- Social Links -->
          <div class="flex items-center gap-2 sm:gap-3">
            <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank" rel="noopener noreferrer"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-orange-normal hover:text-orange-normal transition-colors"
              :aria-label="social.name"
              :title="social.name">
              <Icon v-if="social.icon === 'facebook'" name="simple-icons:facebook" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <Icon v-else-if="social.icon === 'instagram'" name="simple-icons:instagram" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <Icon v-else-if="social.icon === 'x'" name="simple-icons:x" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <Icon v-else-if="social.icon === 'linkedin'" name="simple-icons:linkedin" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <Icon v-else-if="social.icon === 'telegram'" name="simple-icons:telegram" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <Icon v-else-if="social.icon === 'whatsapp'" name="simple-icons:whatsapp" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="md:col-span-8 lg:col-span-9">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <div v-for="(section, key) in footerLinks" :key="key">
              <h3 class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 sm:mb-4">
                {{ section.title }}
              </h3>
              <ul class="space-y-2 sm:space-y-3">
                <li v-for="link in section.links" :key="link.name">
                  <NuxtLink :to="localePath(link.href)"
                    class="text-xs sm:text-sm text-gray-300 hover:text-orange-normal transition-colors">
                    {{ link.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 relative py-10 sm:py-12 md:py-14 lg:py-16">
      <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        <div
          class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-400">
          <span class="text-center">{{ t('footer.copyright') }}</span>
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <NuxtLink :to="localePath('/public_offer')" class="hover:text-white transition-colors">{{ t('footer.privacyPolicy') }}</NuxtLink>
            <NuxtLink :to="localePath('/privacy')" class="hover:text-white transition-colors">{{ t('footer.termsOfService') }}</NuxtLink>
            <NuxtLink :to="localePath('/Registeration_and_licence')" class="hover:text-white transition-colors">{{ t('footer.registrationAndLicence') }}</NuxtLink>
          </div>
        </div>
      </div>

      <div class="h-full overflow-hidden absolute bottom-0 left-0 right-0">
        <NuxtImg :src="footerBg" alt="" class="w-full h-auto object-contain opacity-30 sm:opacity-40 lg:opacity-50" loading="lazy" />
      </div>
    </div>

    
  </footer>
</template>
