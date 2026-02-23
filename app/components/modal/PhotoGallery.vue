<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  images: string[]
  open: boolean
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const currentIndex = ref(props.initialIndex)

const currentImage = computed(() => props.images[currentIndex.value] ?? '')

const goPrev = () => {
  currentIndex.value = currentIndex.value > 0
    ? currentIndex.value - 1
    : props.images.length - 1
}

const goNext = () => {
  currentIndex.value = currentIndex.value < props.images.length - 1
    ? currentIndex.value + 1
    : 0
}

const closeModal = () => {
  emit('close')
}

// Reset index when opening
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    currentIndex.value = props.initialIndex
  }
})

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowLeft') goPrev()
  if (e.key === 'ArrowRight') goNext()
}

// Lock body scroll when modal is open
watch(() => props.open, (newVal) => {
  if (!import.meta.client) return
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="gallery">
      <div
        v-if="open && images.length"
        class="fixed inset-0 z-50 flex flex-col bg-black"
        @click.self="closeModal"
      >
        <!-- Header: close + counter -->
        <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
          <span class="text-white/90 text-sm sm:text-base">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
          <button
            class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            :aria-label="t('tourDetail.gallery.close')"
            @click="closeModal"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- Main image area -->
        <div class="flex-1 flex items-center justify-center p-4 sm:p-6 pt-20 pb-24">
          <div class="relative w-full h-full flex items-center justify-center">
            <NuxtImg
              :src="currentImage"
              :alt="t('tourDetail.gallery.image', { number: currentIndex + 1 })"
              class="max-w-full max-h-full object-contain"
              loading="eager"
            />
          </div>
        </div>

        <!-- Navigation arrows -->
        <button
          v-if="images.length > 1"
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          :aria-label="t('tourDetail.gallery.prev')"
          @click.stop="goPrev"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          v-if="images.length > 1"
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          :aria-label="t('tourDetail.gallery.next')"
          @click.stop="goNext"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Thumbnail strip (if more than 1 image) -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-black/60 overflow-x-auto flex gap-2 justify-center"
        >
          <button
            v-for="(img, idx) in images"
            :key="idx"
            class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all"
            :class="idx === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-90'"
            @click.stop="currentIndex = idx"
          >
            <NuxtImg
              :src="img"
              :alt="t('tourDetail.gallery.image', { number: idx + 1 })"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gallery-enter-active,
.gallery-leave-active {
  transition: opacity 0.3s ease;
}
.gallery-enter-from,
.gallery-leave-to {
  opacity: 0;
}
</style>
