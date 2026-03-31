<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  PHONE_COUNTRY_CODES_SORTED,
  matchDialFromFull
} from '~/constants/phoneCountryCodes'

const props = withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    required?: boolean
    placeholder?: string
    ariaLabel?: string
    /** aria-label for the country code select */
    countryCodeAriaLabel?: string
    wrapperClass?: string
  }>(),
  {
    modelValue: '',
    required: false
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const DEFAULT_DIAL = '+998'

const dialCode = ref(DEFAULT_DIAL)
const national = ref('')

const digitsOnly = (s: string) => s.replace(/\D/g, '')

/** National significant number for E.164 (drop leading trunk zeros). */
const nationalBody = (digits: string) => {
  if (!digits) return ''
  const stripped = digits.replace(/^0+/, '')
  if (stripped.length > 0) return stripped
  return digits
}

const combinedValue = () => {
  const body = nationalBody(digitsOnly(national.value))
  if (!body) return ''
  return `${dialCode.value}${body}`
}

const rebuildFromModelValue = (v: string) => {
  const t = (v || '').trim()
  if (!t) {
    dialCode.value = DEFAULT_DIAL
    national.value = ''
    return
  }
  const dial = matchDialFromFull(t)
  if (dial) {
    dialCode.value = dial
    national.value = digitsOnly(t.slice(dial.length))
    return
  }
  dialCode.value = DEFAULT_DIAL
  national.value = digitsOnly(t)
}

watch(
  () => props.modelValue,
  (v) => {
    if (v === combinedValue()) return
    rebuildFromModelValue(v)
  },
  { immediate: true }
)

watch([dialCode, national], () => {
  const c = combinedValue()
  if (c !== props.modelValue) {
    emit('update:modelValue', c)
  }
})

const onNationalInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  national.value = raw.replace(/[^\d\s-]/g, '')
}

const activeOption = computed(() => {
  return (
    PHONE_COUNTRY_CODES_SORTED.find((o) => o.dial === dialCode.value) ??
    PHONE_COUNTRY_CODES_SORTED[0]!
  )
})

/** Short label for chip, e.g. "US / CA" → "US" */
const activeShortLabel = computed(() => {
  const l = activeOption.value.label
  const i = l.indexOf(' / ')
  return i >= 0 ? l.slice(0, i) : l
})
</script>

<template>
  <div
    :class="[
      'flex w-full items-stretch rounded-xl sm:rounded-2xl border border-gray-200 bg-transparent transition-colors',
      'focus-within:border-gray-400',
      wrapperClass
    ]"
  >
    <!-- Country: one visual block with invisible native select -->
    <div
      class="relative flex max-w-[min(12.5rem,46%)] shrink-0 items-center pl-3 sm:max-w-none sm:pl-4"
    >
      <select
        :id="id ? `${id}-country-code` : undefined"
        v-model="dialCode"
        class="absolute inset-0 z-1 h-full min-h-12 w-full cursor-pointer opacity-0 sm:min-h-13"
        :aria-label="countryCodeAriaLabel"
      >
        <option
          v-for="row in PHONE_COUNTRY_CODES_SORTED"
          :key="`${row.dial}-${row.label}`"
          :value="row.dial"
        >
          {{ row.flag }} {{ row.label }} {{ row.dial }}
        </option>
      </select>
      <div
        class="pointer-events-none flex min-h-12 items-center gap-1.5 py-3 pr-5 sm:min-h-13 sm:py-4"
        aria-hidden="true"
      >
        <span class="text-lg leading-none">{{ activeOption.flag }}</span>
        <span class="whitespace-nowrap text-sm font-medium text-gray-900 sm:text-base">
          {{ activeShortLabel }}
        </span>
        <span class="whitespace-nowrap text-sm text-gray-600 sm:text-base">
          {{ dialCode }}
        </span>
        <svg
          class="ml-0.5 h-4 w-4 shrink-0 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <input
      :id="id"
      :value="national"
      type="tel"
      inputmode="numeric"
      autocomplete="tel-national"
      :required="required"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      class="min-w-0 flex-1 border-0 bg-transparent py-3 pl-1 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:py-4 sm:pr-5 sm:text-base"
      @input="onNationalInput"
    />
  </div>
</template>
