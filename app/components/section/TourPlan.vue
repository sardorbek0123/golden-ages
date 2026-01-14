<script setup lang="ts">
// @ts-expect-error - no types for this package
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'
import type { TripPlan } from '~/types/trip'

interface Props {
  plans: TripPlan[]
}

defineProps<Props>()
const { t } = useI18n()

// Accordion state
const expandedPlanId = ref<number | null>(null)

const togglePlan = (planId: number) => {
  expandedPlanId.value = expandedPlanId.value === planId ? null : planId
}

const isPlanExpanded = (planId: number) => {
  return expandedPlanId.value === planId
}

// Format day number with leading zero
const formatDay = (index: number) => {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <section v-if="plans?.length" class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <div class=" p-10">
        <h3 class="text-4xl font-bold text-gray-900 mb-10">{{ t('tourDetail.tourPlan') }}</h3>
        
        <div class="divide-y divide-gray-100">
          <div 
            v-for="(plan, index) in plans" 
            :key="plan.id"
            class="py-5 first:pt-0 last:pb-0"
          >
            <!-- Accordion Header -->
            <button 
              class="w-full grid grid-cols-[200px_1fr_auto] items-center gap-6 text-left"
              @click="togglePlan(plan.id)"
            >
              <!-- Day Badge -->
              <div 
                class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 text-center justify-self-start"
                :class="isPlanExpanded(plan.id) 
                  ? 'bg-orange-normal text-white' 
                  : 'bg-transparent border border-gray-300 text-gray-600'"
              >
                Day {{ formatDay(index) }}
              </div>
              
              <!-- Plan Name -->
              <h4 class="text-lg font-semibold text-gray-900">
                {{ plan.name }}
              </h4>
              
              <!-- Chevron Icon -->
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                class="text-gray-400 transition-transform duration-300 shrink-0"
                :class="{ 'rotate-180': isPlanExpanded(plan.id) }"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <!-- Accordion Content -->
            <CollapseTransition>
              <div v-show="isPlanExpanded(plan.id)" class="grid grid-cols-[200px_1fr_auto] gap-6 pt-3">
                <div />
                <p v-if="plan.description" class="text-gray-500 leading-relaxed whitespace-pre-line pr-10">{{ plan.description }}</p>
              </div>
            </CollapseTransition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

