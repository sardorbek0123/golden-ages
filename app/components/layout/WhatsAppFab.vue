<script setup lang="ts">
// Placeholder link - replace with real WhatsApp number when ready
const whatsappUrl = 'https://wa.me/1234567890'
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Пульсирующее кольцо — анимация каждые 3 сек -->
    <span class="absolute inset-0 flex h-14 w-14 items-center justify-center">
      <span class="absolute h-14 w-14 animate-whatsapp-ping rounded-full bg-[#25CF43] opacity-40" />
    </span>
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25CF43] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <Icon name="simple-icons:whatsapp" class="h-7 w-7 text-white" />
    </a>
  </div>
</template>
