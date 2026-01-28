<script setup lang="ts">
import EnIcon from '~/components/icons/lang/en.vue'
import RuIcon from '~/components/icons/lang/ru.vue'
import UzIcon from '~/components/icons/lang/uz.vue'
import EsIcon from '~/components/icons/lang/es.vue'
import DeIcon from '~/components/icons/lang/de.vue'
import FrIcon from '~/components/icons/lang/fr.vue'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const isOpen = ref(false)

const availableLocales = computed(() => {
  return locales.value.filter(l => typeof l !== 'string')
})

const currentLocale = computed(() => {
  return availableLocales.value.find(l => l.code === locale.value)
})

const getLangIcon = (code: string) => {
  const iconMap: Record<string, any> = {
    en: EnIcon,
    ru: RuIcon,
    uz: UzIcon,
    es: EsIcon,
    de: DeIcon,
    fr: FrIcon
  }
  return iconMap[code as keyof typeof iconMap] || EnIcon
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLocale = (code: string) => {
  if (code === locale.value) {
    isOpen.value = false
    return
  }
  
  isOpen.value = false
  // Navigate to the same page with new locale and reload to refresh backend data
  const newPath = switchLocalePath(code)
  window.location.href = newPath
}

// Close on click outside
const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Current Language Button -->
    <button
      class="flex items-center gap-2 px-3 py-2 text-black hover:bg-white/10 rounded-lg transition-colors"
      @click="toggleDropdown"
    >
      <component 
        :is="getLangIcon(locale)" 
        class="w-5 h-5"
      />
      <span class="text-sm font-medium uppercase">{{ locale }}</span>
      <svg 
        class="w-4 h-4 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div 
        v-if="isOpen"
        class="absolute top-full right-0 mt-2 bg-[#3a4f61] rounded-xl py-2 min-w-[160px] shadow-xl border border-white/10 z-50"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
          :class="{ 'bg-white/10': loc.code === locale }"
          @click="selectLocale(loc.code)"
        >
          <component 
            :is="getLangIcon(loc.code)" 
            class="w-5 h-5 shrink-0"
          />
          <span class="text-sm text-white">{{ loc.name }}</span>
          <svg 
            v-if="loc.code === locale"
            class="w-4 h-4 text-orange-normal ml-auto"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
