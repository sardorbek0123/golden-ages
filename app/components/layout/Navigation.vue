<script setup lang="ts">
const navItems = [
  'TOURS',
  'ABOUT US',
  'CITIES',
  'SHOP',
  'UZBEK CULTURE',
  'CONTACTS'
]
</script>

<template>
  <nav class="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-gray-dark">
    <ul class="flex items-center gap-3">
      <li v-for="item in navItems" :key="item">
        <NuxtLink
          :to="`#${item.toLowerCase()}`"
          class="nav-link text-white text-base leading-5 font-medium tracking-wide uppercase transition-all relative px-4 py-2 rounded-full"
        >
          {{ item }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-link {
  display: inline-block;
}

.nav-link:hover {
  position: relative;
}

.nav-link:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: #FFFFFF33;
  border-radius: 9999px;
  z-index: -1;
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  background-color: #929292;
  border-radius: 9999px;
  z-index: -2;
}

.nav-link.active {
  background-color: #ffa800;
}

.nav-link.active:hover::before,
.nav-link.active:hover::after {
  display: none;
}
</style>
