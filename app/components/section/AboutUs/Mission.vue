<script setup lang="ts">
import { missionData } from '~/constants/mission'

const { t } = useI18n()
const localePath = useLocalePath()

const expandedId = ref<number>(1)

const toggleItem = (id: number) => {
  expandedId.value = expandedId.value === id ? 0 : id
}

const formatNumber = (num: number) => {
  return num.toString().padStart(2, '0')
}
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6">
    <div class="container mx-auto">
      <div class="bg-[#F9FAF9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <!-- Left Column - Image -->
          <div class="lg:w-1/2">
            <div class="rounded-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-full">
              <NuxtImg
                :src="missionData.image"
                alt="Uzbekistan architecture"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          <!-- Right Column - Content -->
          <div class="lg:w-1/2 flex flex-col">
            <!-- Badge -->
            <span class="inline-flex self-start px-3 py-1 border border-orange-normal text-orange-normal text-xs font-medium uppercase tracking-wide rounded-full mb-4 sm:mb-6">
              {{ t(missionData.badge) }}
            </span>
            
            <!-- Title -->
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-normal leading-tight mb-4 sm:mb-6">
              {{ t(missionData.title) }}
            </h2>
            
            <!-- Description -->
            <p class="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 sm:mb-8">
              {{ t(missionData.description) }}
            </p>
            
            <!-- CTA Button -->
            <NuxtLink
              :to="localePath('/#form')"
              class="inline-flex self-start items-center justify-center px-8 py-3 bg-orange-normal hover:bg-orange-normal-hover text-white font-medium text-sm uppercase tracking-wide rounded-full transition-colors mb-8 sm:mb-10"
            >
              {{ t(missionData.buttonText) }}
            </NuxtLink>
            
            <!-- Accordion Items -->
            <div class="border-l-2 border-gray-200 pl-6 space-y-4">
              <div
                v-for="item in missionData.items"
                :key="item.id"
                class="cursor-pointer"
                @click="toggleItem(item.id)"
              >
                <div class="flex items-start gap-3">
                  <span class="text-sm font-medium text-gray-400 mt-0.5">
                    {{ formatNumber(item.id) }}
                  </span>
                  <div class="flex-1">
                    <h3 
                      class="text-base sm:text-lg font-semibold transition-colors"
                      :class="expandedId === item.id ? 'text-dark-normal' : 'text-gray-600'"
                    >
                      {{ t(item.title) }}
                    </h3>
                    
                    <!-- Expanded content -->
                    <Transition name="accordion">
                      <p 
                        v-if="expandedId === item.id"
                        class="text-sm text-gray-500 leading-relaxed mt-2"
                      >
                        {{ t(item.description) }}
                      </p>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
