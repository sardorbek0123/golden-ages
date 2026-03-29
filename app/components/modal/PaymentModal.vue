<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
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

const isSubmitting = ref(false)
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

const canGoNext = computed(() => step.value === 1 && isStep1Valid.value)
const canPay = computed(() => isStep2Valid.value && !isSubmitting.value)

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

const nextStep = () => {
  if (step.value >= 2 || !canGoNext.value) return
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

  paymentType.value = 'full'

  submitError.value = ''
  isSubmitting.value = false
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const handlePay = async () => {
  if (!isStep2Valid.value || isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = ''

  const payload: Record<string, unknown> = {
    trip_id: props.trip.id,
    people_count: peopleCount.value,
    passengers: passengers.value.map((p) => ({
      first_name: p.firstName.trim(),
      last_name: p.lastName.trim(),
      gender: p.gender,
      country: p.country.trim(),
      passport: p.passport.trim(),
      phone: p.phone.trim()
    })),
    total_amount: paymentAmount.value,
    is_partial_payment: paymentType.value === 'partial'
  }

  try {
    const paymentRes = await post<{
      redirect_url?: string
      payment_url?: string
      url?: string
      checkout_url?: string
    }>('/payment/create/', payload)

    const payUrl =
      paymentRes.redirect_url ??
      paymentRes.payment_url ??
      paymentRes.url ??
      paymentRes.checkout_url

    if (!payUrl) {
      submitError.value = t('tourDetail.paymentModal.redirectMissing')
      return
    }

    if (import.meta.client) {
      window.location.href = payUrl
    }
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

          <div class="p-5 sm:p-6 md:p-8">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-8">{{ t('tourDetail.paymentModal.title') }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ trip.label || trip.name }}</p>

            <div class="grid grid-cols-2 gap-2 mb-6">
              <div v-for="index in 2" :key="index" class="text-center">
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

            <div v-show="step === 2" class="space-y-5">
              <div class="space-y-4">
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
                    <CommonPhoneInput
                      v-model="passenger.phone"
                      wrapper-class="sm:col-span-2"
                      :placeholder="t('common.phoneNationalPlaceholder')"
                      :aria-label="t('tourDetail.paymentModal.phone')"
                      :country-code-aria-label="t('common.countryCallingCode')"
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

              <div class="rounded-2xl bg-gray-50 p-4 sm:p-5 space-y-2">
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">{{ t('tourDetail.paymentModal.paymentType') }}</p>
                <div class="flex flex-col sm:flex-row gap-3 mb-3">
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
                v-if="step < 2"
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
