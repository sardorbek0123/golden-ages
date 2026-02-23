<script setup lang="ts">
import type { TripDetail } from '~/types/trip'

interface Props {
  trip: TripDetail
}

const props = defineProps<Props>()
const { t } = useI18n()
const localePath = useLocalePath()

// All images sorted by order
const allImages = computed(() => {
  if (!props.trip.images?.length) return []
  const sorted = [...props.trip.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted.map(img => img.image).filter(Boolean)
})

// Get main image
const mainImage = computed(() => allImages.value[0] ?? '')

// Get secondary images (for 3+ layout: show 2 next)
const secondaryImages = computed(() => {
  if (!props.trip.images?.length) return []
  const sorted = [...props.trip.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted.slice(1, 3)
})

const galleryOpen = ref(false)
const galleryIndex = ref(0)

const openGallery = (index: number) => {
  galleryIndex.value = index
  galleryOpen.value = true
}

const closeGallery = () => {
  galleryOpen.value = false
}

const hasMoreThanThreePhotos = computed(() => (props.trip.images?.length ?? 0) > 3)

// Go back
const goBack = () => {
  navigateTo(localePath({ name: 'tours' }))
}
</script>

<template>
  <section class="pt-6 sm:pt-8 md:pt-12">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Back Button -->
      <button 
        class="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors mt-12 sm:mt-14 md:mt-16 mb-4 sm:mb-6"
        @click="goBack"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ t('tourDetail.back') }}</span>
      </button>

      <!-- Title -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
        {{ trip.name }}
      </h1>

      <!-- Locations -->
      <div class="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ trip.locations }}</span>
      </div>

      <!-- Image Gallery -->
      <div>
        <!-- Single image layout -->
        <div v-if="trip.images?.length === 1" class="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
          <button
            type="button"
            class="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
            @click="openGallery(0)"
          >
            <NuxtImg 
              :src="mainImage" 
              :alt="trip.name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        </div>

        <!-- Two images layout -->
        <div v-else-if="trip.images?.length === 2" class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <button
            type="button"
            class="md:col-span-2 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer focus:outline-none text-left"
            @click="openGallery(0)"
          >
            <NuxtImg 
              :src="mainImage" 
              :alt="trip.name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
          <button
            type="button"
            class="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer focus:outline-none text-left"
            @click="openGallery(1)"
          >
            <NuxtImg 
              :src="secondaryImages[0]?.image" 
              :alt="`${trip.name} 2`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        </div>

        <!-- Three or more images layout -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div class="md:col-span-2 relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-xl sm:rounded-2xl overflow-hidden">
            <button
              type="button"
              class="absolute inset-0 w-full h-full cursor-pointer focus:outline-none text-left"
              @click="openGallery(0)"
            >
              <NuxtImg 
                :src="mainImage" 
                :alt="trip.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
            <!-- Show All Photos button (when > 3 images) -->
            <button
              v-if="hasMoreThanThreePhotos"
              type="button"
              class="absolute inset-0 flex items-center justify-center cursor-pointer focus:outline-none"
              @click="openGallery(0)"
            >
              <span class="flex items-center gap-2 px-6 py-3 rounded-full bg-black/50 hover:bg-black/60 text-white font-medium text-sm sm:text-base transition-colors backdrop-blur-sm">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                {{ t('tourDetail.gallery.showAll') }}
              </span>
            </button>
          </div>
          <div class="flex flex-col gap-3 sm:gap-4">
            <button
              v-for="(image, index) in secondaryImages" 
              :key="image.id"
              type="button"
              class="h-[120px] sm:h-[170px] md:h-[220px] lg:h-[250px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer focus:outline-none text-left"
              @click="openGallery(index + 1)"
            >
              <NuxtImg 
                :src="image.image" 
                :alt="`${trip.name} ${index + 2}`"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>

      <ModalPhotoGallery
        :images="allImages"
        :open="galleryOpen"
        :initial-index="galleryIndex"
        @close="closeGallery"
      />
    </div>
  </section>
</template>

