<script setup lang="ts">
import footerBg from '~/assets/images/footer.png'
const { t } = useI18n()

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
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-12 gap-8">
        <!-- Logo & Description -->
        <div class="col-span-3">
          <div class="flex items-center gap-2 mb-4">
              <IconsLogo />
          </div>

          <p class="text-gray-400 text-sm mb-6 leading-relaxed">
            {{ t('footer.description') }}
          </p>

          <!-- Social Links -->
          <div class="flex items-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              class="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-orange-normal hover:text-orange-normal transition-colors"
            >
              <svg v-if="social.icon === 'facebook'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <svg v-else-if="social.icon === 'instagram'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <svg v-else-if="social.icon === 'x'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <svg v-else-if="social.icon === 'threads'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.088-1.146 3.5-1.208 1.028-.045 1.964.065 2.815.289l.009-.457c-.022-1.035-.084-1.878-.555-2.494-.436-.57-1.17-.858-2.18-.858h-.039c-.778.007-1.41.197-1.88.565-.477.374-.752.882-.82 1.51l-2.04-.27c.119-1.122.64-2.044 1.508-2.67.905-.651 2.108-.996 3.475-.996h.061c3.272.044 4.973 1.88 5.023 5.436l.013.695c1.022.543 1.833 1.262 2.394 2.134.78 1.214.953 2.69.488 4.155-.53 1.67-1.676 3.058-3.317 4.018C17.522 23.347 15.15 23.98 12.186 24zm.09-7.019c-.866.037-1.532.27-1.988.694-.385.357-.576.783-.553 1.233.024.462.253.85.663 1.116.484.314 1.108.46 1.85.42.986-.053 1.74-.378 2.24-1 .475-.59.731-1.418.762-2.464-.655-.18-1.383-.265-2.186-.265-.266 0-.53.01-.788.027v-.761z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="col-span-9">
          <div class="grid grid-cols-4 gap-8">
            <div v-for="(section, key) in footerLinks" :key="key">
              <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                {{ section.title }}
              </h4>
              <ul class="space-y-3">
                <li v-for="link in section.links" :key="link.name">
                  <a
                    :href="link.href"
                    class="text-sm text-gray-300 hover:text-orange-normal transition-colors"
                  >
                    {{ link.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 relative py-30">
      <div class="container mx-auto px-4 py-6 relative z-10">
        <div class="flex items-center justify-center gap-8 text-sm text-gray-400">
          <span>{{ t('footer.copyright') }}</span>
          <NuxtLink href="#" class="hover:text-white transition-colors">{{ t('footer.privacyPolicy') }}</NuxtLink>
          <NuxtLink href="#" class="hover:text-white transition-colors">{{ t('footer.termsOfService') }}</NuxtLink>
          <NuxtLink href="#" class="hover:text-white transition-colors">{{ t('footer.cookiesSettings') }}</NuxtLink>
        </div>
      </div>

      <div class="h-full overflow-hidden absolute bottom-0 left-0 right-0">
        <img
          :src="footerBg"
          alt=""
          class="w-full h-auto object-contain opacity-50"
        />
      </div>
    </div>

    <!-- WhatsApp Button -->
    <a
      href="https://wa.me/998944448844"
      target="_blank"
      class="fixed bottom-8 right-8 z-50"
    >
      <IconsWhatsapp class="w-16 h-16" />
    </a>
  </footer>
</template>
