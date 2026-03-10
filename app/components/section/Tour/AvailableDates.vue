<script setup lang="ts">
import type { TripPrice } from '~/types/trip'

interface Props {
  prices: TripPrice[]
}

defineProps<Props>()
const { t, locale } = useI18n()

// Get currency symbol based on currency key
const getCurrencySymbol = (currencyKey?: string | null): string => {
  switch (currencyKey) {
    case 'sum':
      return 'UZS'
    case 'dollar':
      return 'US$'
    case 'euro':
      return '€'
    default:
      return 'US$'
  }
}

// Format date to readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

// Format price with currency
const formatPrice = (price: number, currency: TripPrice['currency']): string => {
  const symbol = getCurrencySymbol(currency?.key)
  const formattedPrice = new Intl.NumberFormat('en-US').format(price)
  return `${symbol} ${formattedPrice}`
}

// Scroll to form
const scrollToForm = () => {
  const form = document.getElementById('form')
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section v-if="prices?.length" class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-3xl font-bold text-orange-normal">
          {{ t('tourDetail.availableDates') }}
        </h3>
        <span class="text-gray-500 text-sm">{{ t('tourDetail.perPerson') }}</span>
      </div>

      <!-- Year Badge -->
      <div class="mb-6">
        <span class="text-xl font-bold text-gray-900">2026</span>
      </div>

      <!-- Dates Table (Desktop) -->
      <div class="hidden md:block border border-gray-200 rounded-2xl overflow-hidden">
        <table class="w-full">
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(priceItem, index) in prices"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-6">
                <span class="text-gray-700 font-medium">
                  {{ formatDate(priceItem.date_from) }} - {{ formatDate(priceItem.date_to) }}
                </span>
              </td>

              <td class="py-4 px-6">
                <span 
                  class="font-medium"
                  :class="priceItem.available ? 'text-green-600' : 'text-red-500'"
                >
                  {{ priceItem.available ? t('tourDetail.available') : t('tourDetail.soldOut') }}
                </span>
              </td>

              <td class="py-4 px-6">
                <span class="font-bold text-gray-900">
                  {{ formatPrice(priceItem.price, priceItem.currency) }}
                </span>
              </td>

              <td class="py-4 px-6 text-right">
                <button
                  :disabled="!priceItem.available"
                  class="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                  :class="priceItem.available 
                    ? 'bg-orange-normal text-white hover:bg-orange-normal-hover' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                  @click="scrollToForm"
                >
                  {{ t('tourDetail.bookNow') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dates Cards (Mobile) -->
      <div class="md:hidden divide-y divide-gray-200">
        <div
          v-for="(priceItem, index) in prices"
          :key="index"
          class="py-5"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="text-gray-700 font-medium text-sm leading-snug">
              {{ formatDate(priceItem.date_from) }} -<br>{{ formatDate(priceItem.date_to) }}
            </span>

            <div class="text-right shrink-0">
              <span
                class="font-semibold text-sm"
                :class="priceItem.available ? 'text-green-600' : 'text-gray-400'"
              >
                {{ priceItem.available ? t('tourDetail.available') : t('tourDetail.soldOut') }}
              </span>
              <span
                class="font-bold ml-1"
                :class="priceItem.available ? 'text-gray-900' : 'text-orange-500'"
              >
                {{ formatPrice(priceItem.price, priceItem.currency) }}
              </span>
            </div>
          </div>

          <div v-if="priceItem.available" class="mt-2 flex justify-end">
            <button
              class="w-fit px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm bg-orange-normal text-white hover:bg-orange-normal-hover transition-all duration-200"
              @click="scrollToForm"
            >
              {{ t('tourDetail.bookNow') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

