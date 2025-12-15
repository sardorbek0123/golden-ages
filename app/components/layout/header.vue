<script setup lang="ts">
</script>

<template>
  <header class="absolute top-0 left-0 w-full z-10">
    <!-- Main header section -->
    <div class="px-10 pt-4">
      <div class="container mx-auto px-4">
        <!-- Header container with rounded corners -->
        <div class="bg-[#3a4f61] rounded-2xl px-8 py-4 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <img
              src="~/assets/Logo.svg"
              alt="Golden Ages"
              class="h-10 w-auto"
            />
          </div>
          
          <!-- Navigation -->
          <div class="flex-1 flex justify-center">
            <LayoutNavigation />
          </div>
          
          <!-- CTA Button -->
          <div class="flex items-center">
            <LayoutCreateTourButton />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
