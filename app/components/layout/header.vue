<script setup lang="ts">
const { t } = useI18n()

const activeDropdown = ref<string | null>(null)
const navigationRef = ref<{ closeDropdown: () => void } | null>(null)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
const isMobileMenuOpen = ref(false)
const activeMobileDropdown = ref<string | null>(null)

interface NavItem {
  key: string
  href?: string
  hasDropdown?: boolean
}

const navItems: NavItem[] = [
  { key: 'tours', hasDropdown: true },
  { key: 'aboutUs', href: '/about' },
  { key: 'cities', hasDropdown: true },
  { key: 'shop', href: '/shop' },
  { key: 'uzbekCulture', href: '/culture' },
  { key: 'contacts', href: '/contacts' }
]

const handleDropdownToggle = (menu: string | null) => {
  activeDropdown.value = menu
}

const closeDropdown = () => {
  activeDropdown.value = null
  navigationRef.value?.closeDropdown()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) {
    activeMobileDropdown.value = null
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  activeMobileDropdown.value = null
}

const toggleMobileDropdown = (key: string) => {
  if (activeMobileDropdown.value === key) {
    activeMobileDropdown.value = null
  } else {
    activeMobileDropdown.value = key
  }
}

// Handle click outside to close dropdown
const headerRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Handle scroll to show/hide header
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY < 100) {
    // Always show header at the top
    isHeaderVisible.value = true
  } else if (currentScrollY > lastScrollY.value) {
    // Scrolling down - hide header
    isHeaderVisible.value = false
    closeDropdown()
  } else {
    // Scrolling up - show header
    isHeaderVisible.value = true
  }
  
  lastScrollY.value = currentScrollY
}

// Lock body scroll when mobile menu is open
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <header 
    ref="headerRef"
    class="fixed top-0 left-0 w-full z-50 transition-transform duration-300"
    :class="{ '-translate-y-full': !isHeaderVisible }"
  >
    <!-- Main header section -->
    <div class="px-4 md:px-10 pt-4">
      <div class="container mx-auto px-4">
        <!-- Header container with rounded corners -->
        <div 
          class="bg-[#1111110D] rounded-2xl px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300"
        >
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" @click="closeDropdown">
              <IconsLogo class="w-20 h-10 md:w-[150px] md:h-[35px] lg:max-w-[260px] xl:max-w-[300px] lg:max-h-full"/>
            </NuxtLink>
          </div>
          
          <!-- Navigation - Desktop only -->
          <div class="hidden lg:flex flex-1 justify-center">
            <LayoutNavigation 
              ref="navigationRef"
              @dropdown-toggle="handleDropdownToggle" 
            />
          </div>
          
          <!-- Language Switcher & CTA Button - Desktop only -->
          <div class="hidden lg:flex items-center gap-4">
            <LayoutLanguageSwitcher />
            <LayoutCreateTourButton />
          </div>

          <!-- Mobile: Language Switcher & Burger Button -->
          <div class="lg:hidden flex items-center gap-2">
            <LayoutLanguageSwitcher />
            <button 
              class="flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              @click="toggleMobileMenu"
              aria-label="Toggle menu"
            >
              <span 
                class="block w-6 h-0.5 bg-dark-normal transition-all duration-300"
                :class="{ 'rotate-45 translate-y-2': isMobileMenuOpen }"
              />
              <span 
                class="block w-6 h-0.5 bg-dark-normal transition-all duration-300"
                :class="{ 'opacity-0': isMobileMenuOpen }"
              />
              <span 
                class="block w-6 h-0.5 bg-dark-normal transition-all duration-300"
                :class="{ '-rotate-45 -translate-y-2': isMobileMenuOpen }"
              />
            </button>
          </div>
        </div>

        <!-- Dropdown Container - Desktop only -->
        <Transition name="dropdown">
          <div 
            v-if="activeDropdown"
            class="hidden lg:block mt-2 bg-[#3a4f61] rounded-2xl px-8 py-6"
          >
            <LayoutToursDropdown v-if="activeDropdown === 'tours'" @click="closeDropdown" />
            <LayoutCitiesDropdown v-if="activeDropdown === 'cities'" @click="closeDropdown" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div 
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white z-50 shadow-2xl overflow-y-auto"
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-6 border-b border-grey-normal">
          <NuxtLink to="/" @click="closeMobileMenu">
            <img
              src="~/assets/Logo.svg"
              alt="Golden Ages"
              class="h-8 w-auto"
            />
          </NuxtLink>
          <button 
            class="w-10 h-10 flex items-center justify-center text-dark-normal hover:bg-grey-light rounded-full transition-colors"
            @click="closeMobileMenu"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Navigation -->
        <nav class="p-6">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.key">
              <!-- Item with Dropdown -->
              <template v-if="item.hasDropdown">
                <button
                  class="w-full flex items-center justify-between py-3 px-4 text-dark-normal font-medium text-base uppercase tracking-wide hover:bg-grey-light rounded-lg transition-colors"
                  @click="toggleMobileDropdown(item.key)"
                >
                  {{ t(`nav.${item.key}`) }}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="w-5 h-5 transition-transform duration-300"
                    :class="{ 'rotate-180': activeMobileDropdown === item.key }"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <!-- Dropdown Content -->
                <Transition name="accordion">
                  <div 
                    v-if="activeMobileDropdown === item.key"
                    class="overflow-hidden"
                  >
                    <div class="py-2 pl-6 pr-4 space-y-1">
                      <LayoutToursDropdown 
                        v-if="item.key === 'tours'" 
                        mobile 
                        @click="closeMobileMenu" 
                      />
                      <LayoutCitiesDropdown 
                        v-if="item.key === 'cities'" 
                        mobile 
                        @click="closeMobileMenu" 
                      />
                    </div>
                  </div>
                </Transition>
              </template>

              <!-- Regular Item -->
              <template v-else>
                <NuxtLink
                  :to="item.href"
                  class="block py-3 px-4 text-dark-normal font-medium text-base uppercase tracking-wide hover:bg-grey-light rounded-lg transition-colors"
                  @click="closeMobileMenu"
                >
                  {{ t(`nav.${item.key}`) }}
                </NuxtLink>
              </template>
            </li>
          </ul>
        </nav>

        <!-- Mobile Menu Footer with CTA -->
        <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-grey-normal bg-white">
          <NuxtLink
            to="/create-tour"
            class="flex items-center justify-center gap-2 w-full py-4 px-6 bg-green-normal hover:bg-green-normal-hover text-white font-medium text-sm uppercase tracking-wide rounded-full transition-colors"
            @click="closeMobileMenu"
          >
            {{ t('header.createTour') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide animation for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Accordion animation for dropdowns */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
