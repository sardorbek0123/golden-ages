<script setup lang="ts">
import { computed, watch, nextTick, onUnmounted } from 'vue'
import {
  PHONE_COUNTRY_CODES_SORTED,
  matchDialFromFull,
  flagImageUrl
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

const dropdownOpen = ref(false)
const search = ref('')
const countryRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()

const filteredCountries = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return PHONE_COUNTRY_CODES_SORTED
  return PHONE_COUNTRY_CODES_SORTED.filter(
    (row) => row.label.toLowerCase().includes(q) || row.dial.includes(q)
  )
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    search.value = ''
    nextTick(() => searchInputRef.value?.focus())
  }
}

const selectCountry = (dial: string) => {
  dialCode.value = dial
  dropdownOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (countryRef.value && !countryRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') dropdownOpen.value = false
}

watch(dropdownOpen, (open) => {
  if (open) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeydown)
    })
  } else {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
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
    <!-- Country selector with custom dropdown -->
    <div ref="countryRef" class="relative flex shrink-0 items-center">
      <button
        type="button"
        class="flex min-h-12 items-center gap-1.5 py-3 pl-3 pr-2 sm:min-h-13 sm:py-4 sm:pl-4"
        :aria-label="countryCodeAriaLabel"
        :aria-expanded="dropdownOpen"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <img
          :src="flagImageUrl(activeOption.label)"
          :alt="activeOption.flag"
          width="20"
          height="15"
          class="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
        />
        <span class="whitespace-nowrap text-sm font-medium text-gray-900 sm:text-base">
          {{ activeShortLabel }}
        </span>
        <span class="whitespace-nowrap text-sm text-gray-600 sm:text-base">
          {{ dialCode }}
        </span>
        <svg
          class="ml-0.5 h-4 w-4 shrink-0 text-gray-500 transition-transform"
          :class="{ 'rotate-180': dropdownOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="dropdownOpen"
          role="listbox"
          class="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div class="border-b border-gray-100 p-2">
            <input
              ref="searchInputRef"
              v-model="search"
              type="text"
              :placeholder="$t('common.search')"
              class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
              @keydown.stop
            />
          </div>
          <div class="max-h-52 overflow-y-auto py-1">
            <button
              v-for="row in filteredCountries"
              :key="`${row.dial}-${row.label}`"
              type="button"
              role="option"
              :aria-selected="row.dial === dialCode"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-gray-50"
              :class="{ 'bg-orange-50': row.dial === dialCode }"
              @click="selectCountry(row.dial)"
            >
              <img
                :src="flagImageUrl(row.label)"
                :alt="row.flag"
                width="20"
                height="15"
                class="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
              />
              <span class="text-sm text-gray-900">{{ row.label }}</span>
              <span class="ml-auto text-sm text-gray-500">{{ row.dial }}</span>
            </button>
            <p
              v-if="filteredCountries.length === 0"
              class="px-3 py-4 text-center text-sm text-gray-400"
            >
              {{ $t('common.noResults') }}
            </p>
          </div>
        </div>
      </Transition>
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
