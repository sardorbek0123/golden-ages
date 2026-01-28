<script setup lang="ts">
import footerBg from '~/assets/images/footer.png'
import IconsFacebook from '~/components/icons/social/facebook.vue'
import IconsInstagram from '~/components/icons/social/instagram.vue'
import IconsX from '~/components/icons/social/x.vue'
import IconsThreads from '~/components/icons/social/threads.vue'
const { t } = useI18n()
const localePath = useLocalePath()

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

const socialLinks = [
  { name: 'Facebook', icon: 'facebook', href: '#' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'X', icon: 'x', href: '#' },
  { name: 'Threads', icon: 'threads', href: '#' }
]
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
            <a v-for="social in socialLinks" :key="social.name" :href="social.href"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-orange-normal hover:text-orange-normal transition-colors">
              <IconsFacebook v-if="social.icon === 'facebook'" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <IconsInstagram v-else-if="social.icon === 'instagram'" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <IconsX v-else-if="social.icon === 'x'" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <IconsThreads v-else-if="social.icon === 'threads'" class="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="md:col-span-8 lg:col-span-9">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            <div v-for="(section, key) in footerLinks" :key="key">
              <h4 class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 sm:mb-4">
                {{ section.title }}
              </h4>
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
            <NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white transition-colors">{{ t('footer.privacyPolicy') }}</NuxtLink>
            <NuxtLink :to="localePath('/terms-of-service')" class="hover:text-white transition-colors">{{ t('footer.termsOfService') }}</NuxtLink>
            <NuxtLink :to="localePath('/cookies-settings')" class="hover:text-white transition-colors">{{ t('footer.cookiesSettings') }}</NuxtLink>
          </div>
        </div>
      </div>

      <div class="h-full overflow-hidden absolute bottom-0 left-0 right-0">
        <NuxtImg :src="footerBg" alt="" class="w-full h-auto object-contain opacity-30 sm:opacity-40 lg:opacity-50" loading="lazy" />
      </div>
    </div>

    <!-- WhatsApp Button -->
    <a href="https://wa.me/998944448844" target="_blank"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50">
      <IconsWhatsapp class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
    </a>
  </footer>
</template>
