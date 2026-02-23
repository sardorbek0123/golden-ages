<script setup lang="ts">
import { ref, reactive, watch, onUnmounted, computed } from 'vue'
import type { TripDetail } from '~/types/trip'

const props = defineProps<{
  open: boolean
  trip: TripDetail
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const getCurrencyLabel = (currencyKey?: string | null): string => {
  switch (currencyKey) {
    case 'sum':
      return 'UZS'
    case 'dollar':
      return 'USD'
    case 'euro':
      return 'EUR'
    default:
      return 'USD'
  }
}

const formattedPrice = computed(() => {
  const currencyLabel = getCurrencyLabel(props.trip.currency?.key)
  return new Intl.NumberFormat('uz-UZ').format(props.trip.price) + ' ' + currencyLabel
})

const formData = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const resetForm = () => {
  formData.firstName = ''
  formData.lastName = ''
  formData.phone = ''
  formData.email = ''
  formData.cardholderName = ''
  formData.cardNumber = ''
  formData.expiry = ''
  formData.cvv = ''
  submitSuccess.value = false
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const isFormValid = computed(() => {
  return (
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.cardholderName.trim() !== '' &&
    formData.cardNumber.replace(/\s/g, '').length >= 16 &&
    formData.expiry.length >= 5 &&
    formData.cvv.length >= 3
  )
})

// Format card number with spaces (XXXX XXXX XXXX XXXX)
const formatCardNumber = (value: string) => {
  const v = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16)
  return v.replace(/(.{4})/g, '$1 ').trim()
}

const onCardNumberInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.cardNumber = formatCardNumber(target.value)
}

// Format expiry (MM/YY)
const formatExpiry = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2)
  }
  return v
}

const onExpiryInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.expiry = formatExpiry(target.value)
}

const onCvvInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.cvv = target.value.replace(/\D/g, '').slice(0, 4)
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true
  // Simulate payment processing (replace with actual payment integration)
  await new Promise(resolve => setTimeout(resolve, 1500))
  isSubmitting.value = false
  submitSuccess.value = true

  setTimeout(() => {
    closeModal()
  }, 2000)
}

// Lock body scroll when modal is open
let scrollY = 0
watch(() => props.open, (newVal) => {
  if (!import.meta.client) return
  if (newVal) {
    scrollY = window.scrollY
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  } else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    window.scrollTo(0, scrollY)
    resetForm()
  }
}, { immediate: true })

onUnmounted(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" @click.self="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[95vh]">
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
            :aria-label="t('tourDetail.gallery.close')"
            @click="closeModal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Success State -->
          <div v-if="submitSuccess" class="text-center py-8 sm:py-10 px-6 sm:px-8">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ t('tourDetail.paymentModal.successTitle') }}</h3>
            <p class="text-sm sm:text-base text-gray-600">{{ t('tourDetail.paymentModal.successMessage') }}</p>
          </div>

          <!-- Form -->
          <form v-else class="p-5 sm:p-6 md:p-8" @submit.prevent="handleSubmit">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8">{{ t('tourDetail.paymentModal.title') }}</h3>
            <p class="text-sm text-gray-500 mb-4 sm:mb-6">{{ trip.label || trip.name }}</p>

            <!-- Personal Info Section -->
            <div class="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">{{ t('tourDetail.paymentModal.personalInfo') }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.firstName') }}</label>
                  <input
                    v-model="formData.firstName"
                    type="text"
                    required
                    :placeholder="t('tourDetail.paymentModal.firstName')"
                    class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.lastName') }}</label>
                  <input
                    v-model="formData.lastName"
                    type="text"
                    required
                    :placeholder="t('tourDetail.paymentModal.lastName')"
                    class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.phone') }}</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  required
                  :placeholder="t('tourDetail.paymentModal.phone')"
                  class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.email') }}</label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  :placeholder="t('tourDetail.paymentModal.email')"
                  class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Card Details Section -->
            <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pt-4 sm:pt-5 border-t border-gray-100">
              <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">{{ t('tourDetail.paymentModal.cardDetails') }}</p>
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.cardholderName') }}</label>
                <input
                  v-model="formData.cardholderName"
                  type="text"
                  required
                  :placeholder="t('tourDetail.paymentModal.cardholderNamePlaceholder')"
                  class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                  autocomplete="cc-name"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.cardNumber') }}</label>
                <input
                  :value="formData.cardNumber"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  :placeholder="t('tourDetail.paymentModal.cardNumberPlaceholder')"
                  class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 font-mono tracking-wider"
                  @input="onCardNumberInput"
                />
              </div>
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.expiry') }}</label>
                  <input
                    :value="formData.expiry"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    placeholder="MM/YY"
                    class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 font-mono"
                    maxlength="5"
                    @input="onExpiryInput"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2">{{ t('tourDetail.paymentModal.cvv') }}</label>
                  <input
                    :value="formData.cvv"
                    type="password"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    :placeholder="t('tourDetail.paymentModal.cvvPlaceholder')"
                    class="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 font-mono"
                    maxlength="4"
                    @input="onCvvInput"
                  />
                </div>
              </div>
            </div>

            <!-- Pay Button -->
            <button
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="w-full py-3 sm:py-4 bg-orange-normal text-white text-sm sm:text-base font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span v-if="isSubmitting">{{ t('tourDetail.paymentModal.processing') }}</span>
              <span v-else>{{ t('tourDetail.paymentModal.pay') }} {{ formattedPrice }}</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
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

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
