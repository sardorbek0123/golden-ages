<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import type { TripDetail } from '~/types/trip'

interface Passenger {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  country: string
  passport: string
  phone: string
}

const props = defineProps<{
  open: boolean
  trip: TripDetail
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { post } = useApi()

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

const currencyLabel = computed(() => getCurrencyLabel(props.trip.currency?.key))
const formatMoney = (value: number) => `${new Intl.NumberFormat('uz-UZ').format(value)} ${currencyLabel.value}`

const effectivePrice = computed(() =>
  props.trip.discount && props.trip.discount_price != null
    ? props.trip.discount_price
    : props.trip.price
)
const hasDiscount = computed(() => props.trip.discount && props.trip.discount_price != null)

const step = ref(1)
const peopleCount = ref(1)
const passengers = ref<Passenger[]>([])
const paymentType = ref<'full' | 'partial'>('full')

const payment = reactive({
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardHolderName: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const createPassenger = (): Passenger => ({
  firstName: '',
  lastName: '',
  gender: 'male',
  country: '',
  passport: '',
  phone: ''
})

const normalizePeopleCount = (value: number) => {
  if (Number.isNaN(value)) return 1
  return Math.max(1, Math.min(10, Math.trunc(value)))
}

watch(peopleCount, (count) => {
  const normalized = normalizePeopleCount(count)
  if (normalized !== count) {
    peopleCount.value = normalized
    return
  }

  if (passengers.value.length < normalized) {
    const missing = normalized - passengers.value.length
    passengers.value.push(...Array.from({ length: missing }, () => createPassenger()))
  } else if (passengers.value.length > normalized) {
    passengers.value.splice(normalized)
  }
}, { immediate: true })

const subtotal = computed(() => peopleCount.value * effectivePrice.value)

const paymentAmount = computed(() =>
  paymentType.value === 'partial' ? Math.round(subtotal.value * 0.3) : subtotal.value
)

const isStep1Valid = computed(() => peopleCount.value >= 1 && peopleCount.value <= 10)

const passportRegex = /^[A-Z0-9 ]+$/

const isPassengerValid = (passenger: Passenger) => (
  passenger.firstName.trim() !== '' &&
  passenger.lastName.trim() !== '' &&
  passenger.gender !== undefined &&
  passenger.country.trim() !== '' &&
  passenger.passport.trim().length >= 6 &&
  passportRegex.test(passenger.passport.trim()) &&
  passenger.phone.trim() !== ''
)

const isStep2Valid = computed(() => {
  if (passengers.value.length !== peopleCount.value) return false
  return passengers.value.every(isPassengerValid)
})

const cardDigits = computed(() => payment.cardNumber.replace(/\s/g, ''))
const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/

const isExpiryValid = computed(() => {
  if (!expiryRegex.test(payment.expiry)) return false
  const parts = payment.expiry.split('/').map(Number)
  const mm = parts[0] ?? 0
  const yy = parts[1] ?? 0
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (yy < currentYear) return false
  if (yy === currentYear && mm < currentMonth) return false
  return true
})

const expiryError = computed(() => {
  if (!payment.expiry) return ''
  if (!expiryRegex.test(payment.expiry)) return ''
  const parts = payment.expiry.split('/').map(Number)
  const mm = parts[0] ?? 0
  const yy = parts[1] ?? 0
  if (mm < 1 || mm > 12) return t('tourDetail.paymentModal.expiryErrorInvalid')
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return t('tourDetail.paymentModal.expiryErrorExpired')
  }
  return ''
})

const isStep3Valid = computed(() => {
  return (
    cardDigits.value.length === 16 &&
    /^\d+$/.test(cardDigits.value) &&
    isExpiryValid.value &&
    /^\d{3,4}$/.test(payment.cvc) &&
    payment.cardHolderName.trim().length >= 2
  )
})

const canGoNext = computed(() => (step.value === 1 ? isStep1Valid.value : isStep2Valid.value))
const canPay = computed(() => isStep3Valid.value && !isSubmitting.value)

const onPeopleCountInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  peopleCount.value = normalizePeopleCount(Number(target.value))
}

const updatePeopleCount = (delta: number) => {
  peopleCount.value = normalizePeopleCount(peopleCount.value + delta)
}

const onPassportInput = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement
  const passenger = passengers.value[index]
  if (!passenger) return
  passenger.passport = target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '')
}

const formatCardNumber = (value: string) => {
  const raw = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16)
  return raw.replace(/(.{4})/g, '$1 ').trim()
}

const onCardNumberInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  payment.cardNumber = formatCardNumber(target.value)
}

const onExpiryInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const raw = target.value.replace(/\D/g, '').slice(0, 4)
  if (raw.length >= 2) {
    let mm = parseInt(raw.slice(0, 2), 10)
    const yy = raw.slice(2)
    if (mm > 12) mm = 12
    if (mm === 0) mm = 1
    payment.expiry = `${String(mm).padStart(2, '0')}/${yy}`
    return
  }
  if (raw.length === 1 && parseInt(raw, 10) > 1) {
    payment.expiry = `0${raw}`
    return
  }
  payment.expiry = raw
}

const onCvcInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  payment.cvc = target.value.replace(/\D/g, '').slice(0, 4)
}

const nextStep = () => {
  if (step.value >= 3 || !canGoNext.value) return
  step.value += 1
}

const prevStep = () => {
  if (step.value <= 1) return
  step.value -= 1
}

const resetForm = () => {
  step.value = 1
  peopleCount.value = 1
  passengers.value = Array.from({ length: 1 }, () => createPassenger())

  payment.cardNumber = ''
  payment.expiry = ''
  payment.cvc = ''
  payment.cardHolderName = ''
  paymentType.value = 'full'

  submitError.value = ''
  submitSuccess.value = false
  isSubmitting.value = false
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const handlePay = async () => {
  if (!isStep3Valid.value || isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  const payload = {
    tourId: props.trip.id,
    peopleCount: peopleCount.value,
    passengers: passengers.value,
    payment: {
      cardNumber: cardDigits.value,
      expiry: payment.expiry,
      cvc: payment.cvc,
      cardHolderName: payment.cardHolderName.trim()
    },
    totalAmount: paymentAmount.value,
    isPartialPayment: paymentType.value === 'partial'
  }

  try {
    await post('/bookings/create/', payload)
    submitSuccess.value = true
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (error) {
    submitError.value = error instanceof Error
      ? error.message
      : t('tourDetail.paymentModal.paymentError')
  } finally {
    isSubmitting.value = false
  }
}

// Lock body scroll when modal is open + sync passengers when opening
let scrollY = 0
watch(() => props.open, (newVal) => {
  if (!import.meta.client) return
  if (newVal) {
    // Ensure passengers array is synced with peopleCount when modal opens
    const count = normalizePeopleCount(peopleCount.value)
    if (passengers.value.length !== count) {
      passengers.value = Array.from({ length: count }, () => createPassenger())
    }
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
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div class="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[95vh]">
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

          <div v-if="submitSuccess" class="text-center py-8 sm:py-10 px-6 sm:px-8">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ t('tourDetail.paymentModal.successTitle') }}</h3>
            <p class="text-sm sm:text-base text-gray-600">{{ t('tourDetail.paymentModal.successMessage') }}</p>
          </div>

          <div v-else class="p-5 sm:p-6 md:p-8">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-8">{{ t('tourDetail.paymentModal.title') }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ trip.label || trip.name }}</p>

            <div class="grid grid-cols-3 gap-2 mb-6">
              <div v-for="index in 3" :key="index" class="text-center">
                <div
                  class="h-1.5 rounded-full"
                  :class="index <= step ? 'bg-orange-normal' : 'bg-gray-200'"
                />
                <p
                  class="mt-2 text-xs sm:text-sm font-medium"
                  :class="index === step ? 'text-orange-normal' : 'text-gray-500'"
                >
                  {{ t('tourDetail.paymentModal.step', { number: index }) }}
                </p>
              </div>
            </div>

            <div v-show="step === 1" class="space-y-5">
              <div class="rounded-2xl border border-gray-200 p-4 sm:p-5">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-3">{{ t('tourDetail.paymentModal.peopleCount') }}</p>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="w-10 h-10 rounded-full border border-gray-300 text-lg font-semibold disabled:opacity-50"
                    :disabled="peopleCount <= 1"
                    @click="updatePeopleCount(-1)"
                  >
                    -
                  </button>
                  <input
                    :value="peopleCount"
                    type="number"
                    min="1"
                    max="10"
                    class="w-20 text-center px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900"
                    @input="onPeopleCountInput"
                  />
                  <button
                    type="button"
                    class="w-10 h-10 rounded-full border border-gray-300 text-lg font-semibold disabled:opacity-50"
                    :disabled="peopleCount >= 10"
                    @click="updatePeopleCount(1)"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="rounded-2xl bg-gray-50 p-4 sm:p-5 space-y-2">
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>{{ t('tourDetail.paymentModal.pricePerPerson') }}</span>
                  <div class="text-right">
                    <span class="font-semibold" :class="hasDiscount ? 'text-orange-normal' : 'text-gray-900'">{{ formatMoney(effectivePrice) }}</span>
                    <span v-if="hasDiscount" class="ml-2 text-gray-400 line-through text-xs">{{ formatMoney(trip.price) }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{{ t('tourDetail.paymentModal.subtotal') }}</span>
                  <span>{{ formatMoney(subtotal) }}</span>
                </div>
              </div>
            </div>

            <div v-show="step === 2" class="space-y-4">
              <div
                v-for="(passenger, index) in passengers"
                :key="index"
                class="border border-gray-200 rounded-2xl p-4 sm:p-5"
              >
                <p class="text-sm font-semibold text-gray-900 mb-3">{{ t('tourDetail.paymentModal.person', { number: index + 1 }) }}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    v-model="passenger.firstName"
                    type="text"
                    :placeholder="t('tourDetail.paymentModal.firstName')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    v-model="passenger.lastName"
                    type="text"
                    :placeholder="t('tourDetail.paymentModal.lastName')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                  />
                  <select
                    v-model="passenger.gender"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="male">{{ t('tourDetail.paymentModal.male') }}</option>
                    <option value="female">{{ t('tourDetail.paymentModal.female') }}</option>
                    <option value="other">{{ t('tourDetail.paymentModal.other') }}</option>
                  </select>
                  <input
                    v-model="passenger.country"
                    type="text"
                    :placeholder="t('tourDetail.paymentModal.country')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                  />
                  <input
                    :value="passenger.passport"
                    type="text"
                    :placeholder="t('tourDetail.paymentModal.passportPlaceholder')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                    @input="onPassportInput(index, $event)"
                  />
                  <input
                    v-model="passenger.phone"
                    type="tel"
                    :placeholder="t('tourDetail.paymentModal.phone')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <p
                  v-if="passenger.passport && (!passportRegex.test(passenger.passport.trim()) || passenger.passport.trim().length < 6)"
                  class="text-xs text-red-500 mt-2"
                >
                  {{ t('tourDetail.paymentModal.passportError') }}
                </p>
              </div>
            </div>

            <div v-show="step === 3" class="space-y-5">
              <div class="rounded-2xl bg-gray-50 p-4 sm:p-5 space-y-2">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">{{ t('tourDetail.paymentModal.paymentType') }}</p>
                <div class="flex gap-3 mb-3">
                  <button
                    type="button"
                    :class="['flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-colors', paymentType === 'full' ? 'border-orange-normal bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                    @click="paymentType = 'full'"
                  >
                    {{ t('tourDetail.paymentModal.fullPayment') }}
                  </button>
                  <button
                    type="button"
                    :class="['flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-colors', paymentType === 'partial' ? 'border-orange-normal bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
                    @click="paymentType = 'partial'"
                  >
                    {{ t('tourDetail.paymentModal.partialPayment') }}
                  </button>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>{{ t('tourDetail.paymentModal.pricePerPerson') }}</span>
                  <div class="text-right">
                    <span class="font-semibold" :class="hasDiscount ? 'text-orange-normal' : 'text-gray-900'">{{ formatMoney(effectivePrice) }}</span>
                    <span v-if="hasDiscount" class="ml-2 text-gray-400 line-through text-xs">{{ formatMoney(trip.price) }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>{{ t('tourDetail.paymentModal.people') }}</span>
                  <span class="font-semibold text-gray-900">{{ peopleCount }}</span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>{{ t('tourDetail.paymentModal.subtotal') }}</span>
                  <span class="font-semibold text-gray-900">{{ formatMoney(subtotal) }}</span>
                </div>
                <div class="flex items-center justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{{ t('tourDetail.paymentModal.amountToPay') }}</span>
                  <span>{{ formatMoney(paymentAmount) }}</span>
                </div>
                <p v-if="paymentType === 'partial'" class="text-xs text-gray-500">
                  {{ t('tourDetail.paymentModal.partialPaymentHint') }}
                </p>
              </div>

              <div class="space-y-3">
                <input
                  v-model="payment.cardHolderName"
                  type="text"
                  :placeholder="t('tourDetail.paymentModal.cardholderName')"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-gray-900 placeholder:text-gray-500"
                  autocomplete="cc-name"
                />
                <input
                  :value="payment.cardNumber"
                  type="text"
                  inputmode="numeric"
                  :placeholder="t('tourDetail.paymentModal.cardNumberPlaceholder')"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none font-mono tracking-wider text-gray-900 placeholder:text-gray-500"
                  autocomplete="cc-number"
                  @input="onCardNumberInput"
                />
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <input
                      :value="payment.expiry"
                      type="text"
                      inputmode="numeric"
                      :placeholder="t('tourDetail.paymentModal.expiryPlaceholder')"
                      maxlength="5"
                      :class="['w-full px-4 py-3 border rounded-xl focus:outline-none font-mono text-gray-900 placeholder:text-gray-500', expiryError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-400']"
                      autocomplete="cc-exp"
                      @input="onExpiryInput"
                    />
                    <p v-if="expiryError" class="text-xs text-red-500">{{ expiryError }}</p>
                  </div>
                  <input
                    :value="payment.cvc"
                    type="password"
                    inputmode="numeric"
                    :placeholder="t('tourDetail.paymentModal.cvvPlaceholder')"
                    maxlength="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none font-mono text-gray-900 placeholder:text-gray-500"
                    autocomplete="cc-csc"
                    @input="onCvcInput"
                  />
                </div>
              </div>

              <p v-if="submitError" class="text-sm text-red-500">{{ submitError }}</p>
            </div>

            <div class="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                class="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 disabled:opacity-40"
                :disabled="step === 1 || isSubmitting"
                @click="prevStep"
              >
                {{ t('tourDetail.paymentModal.back') }}
              </button>

              <button
                v-if="step < 3"
                type="button"
                class="px-6 py-2.5 rounded-full bg-orange-normal text-white text-sm font-semibold disabled:opacity-50"
                :disabled="!canGoNext || isSubmitting"
                @click="nextStep"
              >
                {{ t('tourDetail.paymentModal.next') }}
              </button>

              <button
                v-else
                type="button"
                class="px-6 py-2.5 rounded-full bg-orange-normal text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                :disabled="!canPay"
                @click="handlePay"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>{{ isSubmitting ? t('tourDetail.paymentModal.processing') : t('tourDetail.paymentModal.pay') }}</span>
              </button>
            </div>
          </div>
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
