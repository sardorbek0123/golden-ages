<script setup lang="ts">
import { goalsData } from '~/constants/goals'

const { t } = useI18n()
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto">
      <div class="bg-[#F9FAF9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <!-- Left Column - Title and Description -->
          <div class="lg:w-2/5 lg:pr-4">
            <!-- Badge -->
            <span class="inline-flex px-3 py-1 border border-orange-normal text-orange-normal text-xs font-medium uppercase tracking-wide rounded-full mb-4 sm:mb-6">
              {{ t(goalsData.badge) }}
            </span>
            
            <!-- Title -->
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-normal leading-tight mb-4 sm:mb-6">
              {{ t(goalsData.title) }}
            </h2>
            
            <!-- Description -->
            <p class="text-sm sm:text-base text-gray-500 leading-relaxed">
              {{ t(goalsData.description) }}
            </p>
          </div>
          
          <!-- Right Column - Stats Grid -->
          <div class="lg:w-3/5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- First card spans full height on desktop -->
                <CardsGoalCard
                  :badge="t(goalsData.cards[0]?.badge || '')"
                  :value="t(goalsData.cards[0]?.value || '')"
                  :description="t(goalsData.cards[0]?.description || '')"
                  :image="goalsData.cards[0]?.image || ''"
                  class="h-full"
                />
              
              <!-- Other cards -->
              <CardsGoalCard
                v-for="card in goalsData.cards.slice(1)"
                :key="card.id"
                :badge="t(card.badge)"
                :value="t(card.value)"
                :description="t(card.description)"
                :image="card.image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
