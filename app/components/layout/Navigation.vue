<script setup lang="ts">
import { navItems } from '~/constants/navigation'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const emit = defineEmits<{
  (e: 'dropdown-toggle', menu: string | null): void
}>()


const activeDropdown = ref<string | null>(null)

// Check if route matches nav item
const isRouteActive = (item: NavItem) => {
  const currentPath = route.path
  // For items with matchPath (like tours), check if route starts with it
  if (item.matchPath) {
    return currentPath === item.matchPath || currentPath.startsWith(item.matchPath + '/')
  }
  // For regular items, exact match
  return item.href && currentPath === item.href
}

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
  <nav class="bg-[#DADADA] backdrop-blur-sm rounded-full p-2 border border-gray-dark">
    <ul class="flex items-center gap-3">
      <li
        v-for="item in navItems"
        :key="item.key"
      >
        <NuxtLink
          :to="localePath(item.href || '/')"
          class="nav-link text-black text-base leading-5 font-medium tracking-wide uppercase transition-all relative px-4 py-2 rounded-full"
          :class="{
            'active': activeDropdown === item.key,
            'route-active': isRouteActive(item)
          }"
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

/* Active route styling */
.nav-link.route-active {
  background-color: #FFA800;
  color: white;
}

.nav-link.route-active:hover::before,
.nav-link.route-active:hover::after {
  display: none;
}
</style>
