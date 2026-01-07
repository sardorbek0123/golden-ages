<script setup lang="ts">
const activeDropdown = ref<string | null>(null)
const navigationRef = ref<{ closeDropdown: () => void } | null>(null)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)

const handleDropdownToggle = (menu: string | null) => {
  activeDropdown.value = menu
}

const closeDropdown = () => {
  activeDropdown.value = null
  navigationRef.value?.closeDropdown()
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    ref="headerRef"
    class="fixed top-0 left-0 w-full z-50 transition-transform duration-300"
    :class="{ '-translate-y-full': !isHeaderVisible }"
  >
    <!-- Main header section -->
    <div class="px-10 pt-4">
      <div class="container mx-auto px-4">
        <!-- Header container with rounded corners -->
        <div 
          class="bg-[#3a4f61] rounded-2xl px-8 py-4 flex items-center justify-between transition-all duration-300"
          :class="{ 'rounded-b-none': activeDropdown }"
        >
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" @click="closeDropdown">
              <img
                src="~/assets/Logo.svg"
                alt="Golden Ages"
                class="h-10 w-auto"
              />
            </NuxtLink>
          </div>
          
          <!-- Navigation -->
          <div class="flex-1 flex justify-center">
            <LayoutNavigation 
              ref="navigationRef"
              @dropdown-toggle="handleDropdownToggle" 
            />
          </div>
          
          <!-- Language Switcher & CTA Button -->
          <div class="flex items-center gap-4">
            <LayoutLanguageSwitcher />
            <LayoutCreateTourButton />
          </div>
        </div>

        <!-- Dropdown Container -->
        <Transition name="dropdown">
          <div 
            v-if="activeDropdown"
            class="bg-[#3a4f61] rounded-b-2xl px-8 py-6"
          >
            <LayoutToursDropdown v-if="activeDropdown === 'tours'" @click="closeDropdown" />
            <LayoutCitiesDropdown v-if="activeDropdown === 'cities'" @click="closeDropdown" />
          </div>
        </Transition>
      </div>
    </div>
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
</style>
