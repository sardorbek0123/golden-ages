<script setup lang="ts">
import type { TripProperty } from '~/types/trip'

interface Props {
  properties: TripProperty[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const includedItems = computed(() =>
  props.properties.filter(p => p.included)
)

const notIncludedItems = computed(() =>
  props.properties.filter(p => !p.included)
)
</script>

<template>
  <section v-if="properties?.length" class="py-8 sm:py-10 md:py-12">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="p-5 sm:p-6 md:p-8 lg:p-10">
        <!-- Two Column Headers -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Included Column -->
          <div>
            <div class="border border-gray-200 rounded-full py-3 sm:py-4 px-6 text-center mb-6 sm:mb-8">
              <h3 class="text-base sm:text-lg font-bold text-gray-900">
                {{ t('tourDetail.properties.included') }}
              </h3>
            </div>
            <div class="space-y-4 sm:space-y-5">
              <div
                v-for="item in includedItems"
                :key="item.id"
                class="bg-[#F4F5F4] rounded-xl sm:rounded-2xl p-4 sm:p-5"
              >
                <p class="text-sm font-semibold text-gray-900 mb-1">{{ item.property.name }}</p>
                <div class="text-sm text-gray-600 prose prose-sm max-w-none" v-html="item.value" />
              </div>
            </div>
          </div>

          <!-- Not Included Column -->
          <div>
            <div class="border border-gray-200 rounded-full py-3 sm:py-4 px-6 text-center mb-6 sm:mb-8">
              <h3 class="text-base sm:text-lg font-bold text-gray-900">
                {{ t('tourDetail.properties.notIncluded') }}
              </h3>
            </div>
            <div class="space-y-4 sm:space-y-5">
              <div
                v-for="item in notIncludedItems"
                :key="item.id"
                class="bg-[#F4F5F4] rounded-xl sm:rounded-2xl p-4 sm:p-5"
              >
                <p class="text-sm font-semibold text-gray-900 mb-1">{{ item.property.name }}</p>
                <div class="text-sm text-gray-600 prose prose-sm max-w-none" v-html="item.value" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
