<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'dropdown-toggle', menu: string | null): void
}>()

interface NavItem {
  key: string
  href: string
  hasDropdown?: boolean
}

const navItems: NavItem[] = [
  { key: 'tours', href: '/tours', hasDropdown: true },
  { key: 'aboutUs', href: '/about' },
  { key: 'cities', href: '/cities', hasDropdown: true },
  { key: 'shop', href: '/shop' },
  { key: 'uzbekCulture', href: '/culture' },
  { key: 'contacts', href: '/contacts' }
]

const activeDropdown = ref<string | null>(null)

const handleClick = (item: NavItem, event: Event) => {
  if (item.hasDropdown) {
    event.preventDefault()
    if (activeDropdown.value === item.key) {
      activeDropdown.value = null
      emit('dropdown-toggle', null)
    } else {
      activeDropdown.value = item.key
      emit('dropdown-toggle', item.key)
    }
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
}

defineExpose({
  closeDropdown
})
</script>

<template>
  <nav class="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-gray-dark">
    <ul class="flex items-center gap-3">
      <li 
        v-for="item in navItems" 
        :key="item.key"
      >
        <NuxtLink
          :to="item.href"
          class="nav-link text-white text-base leading-5 font-medium tracking-wide uppercase transition-all relative px-4 py-2 rounded-full"
          :class="{ 'active': activeDropdown === item.key }"
          @click="handleClick(item, $event)"
        >
          {{ t(`nav.${item.key}`) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-link {
  display: inline-block;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.active {
  position: relative;
}

.nav-link:hover::before,
.nav-link.active::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: #FFFFFF33;
  border-radius: 9999px;
  z-index: -1;
}

.nav-link:hover::after,
.nav-link.active::after {
  content: '';
  position: absolute;
  background-color: #929292;
  border-radius: 9999px;
  z-index: -2;
}
</style>
