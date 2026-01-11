<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue'
import type { ReviewCreate } from '~/types'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const reviewsStore = useReviewsStore()

const hoveredRating = ref(0)

const formData = reactive<ReviewCreate>({
  rating: 0,
  full_name: '',
  role: '',
  review: ''
})

const resetForm = () => {
  formData.rating = 0
  formData.full_name = ''
  formData.role = ''
  formData.review = ''
  hoveredRating.value = 0
}

const closeModal = () => {
  emit('close')
  resetForm()
  reviewsStore.resetSubmitState()
}

const setRating = (rating: number) => {
  formData.rating = rating
}

const handleSubmit = async () => {
  if (formData.rating === 0 || !formData.full_name || !formData.review) {
    return
  }

  const success = await reviewsStore.createReview(formData)
  if (success) {
    setTimeout(() => {
      closeModal()
    }, 2000)
  }
}

// Lock body scroll when modal is open
watch(() => props.open, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    resetForm()
    reviewsStore.resetSubmitState()
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform">
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
            @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Success State -->
          <div v-if="reviewsStore.submitSuccess" class="text-center py-8">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ t('testimonials.modal.successTitle') }}</h3>
            <p class="text-gray-600">{{ t('testimonials.modal.successMessage') }}</p>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleSubmit">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ t('testimonials.modal.title') }}</h3>

            <!-- Rating -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                {{ t('testimonials.modal.rating') }}
              </label>
              <div class="flex gap-2">
                <button v-for="star in 5" :key="star" type="button"
                  class="w-10 h-10 flex items-center justify-center transition-transform hover:scale-110"
                  @click="setRating(star)" @mouseenter="hoveredRating = star" @mouseleave="hoveredRating = 0">
                  <svg width="28" height="28" viewBox="0 0 24 24"
                    :fill="star <= (hoveredRating || formData.rating) ? '#f59e0b' : 'none'"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      :stroke="star <= (hoveredRating || formData.rating) ? '#f59e0b' : '#d1d5db'" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Full Name -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {{ t('testimonials.modal.fullName') }}
              </label>
              <input v-model="formData.full_name" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-normal focus:border-transparent transition-all"
                :placeholder="t('testimonials.modal.fullNamePlaceholder')" />
            </div>

            <!-- Role -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {{ t('testimonials.modal.role') }}
              </label>
              <input v-model="formData.role" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-normal focus:border-transparent transition-all"
                :placeholder="t('testimonials.modal.rolePlaceholder')" />
            </div>

            <!-- Review Text -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {{ t('testimonials.modal.review') }}
              </label>
              <textarea v-model="formData.review" rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-normal focus:border-transparent transition-all resize-none"
                :placeholder="t('testimonials.modal.reviewPlaceholder')" />
            </div>

            <!-- Error Message -->
            <div v-if="reviewsStore.error"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ reviewsStore.error }}
            </div>

            <!-- Submit Button -->
            <button type="submit"
              :disabled="reviewsStore.submitting || formData.rating === 0 || !formData.full_name || !formData.review"
              class="w-full py-4 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="reviewsStore.submitting" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ reviewsStore.submitting ? t('testimonials.modal.submitting') : t('testimonials.modal.submit') }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference '~/assets/css/main.css';

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

input, textarea {
  @apply placeholder:text-gray-500 text-gray-700;
}
</style>
