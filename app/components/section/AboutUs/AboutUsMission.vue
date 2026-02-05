<script setup lang="ts">
const { t } = useI18n()

const activeItem = ref(0)

const missionItems = computed(() => [
  {
    title: t('aboutUs.mission.items.authentic.title'),
    description: t('aboutUs.mission.items.authentic.description')
  },
  {
    title: t('aboutUs.mission.items.customisable.title'),
    description: t('aboutUs.mission.items.customisable.description')
  },
  {
    title: t('aboutUs.mission.items.modular.title'),
    description: t('aboutUs.mission.items.modular.description')
  }
])

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

const toggleItem = (index: number) => {
  activeItem.value = activeItem.value === index ? -1 : index
}
</script>

<template>
  <section class="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-white">
    <div class="container mx-auto">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-stretch">
        <!-- Left: Image -->
        <div class="w-full lg:w-1/2 xl:w-[45%]">
          <div class="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden">
            <NuxtImg
              src="/images/hero_bg.jpg"
              alt="Silk Road Architecture"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Right: Content -->
        <div class="w-full lg:w-1/2 xl:w-[55%] flex flex-col justify-center">
          <CommonBadge :text="t('aboutUs.mission.badge')" />
          
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-dark-normal leading-tight mb-4 sm:mb-6 font-display">
            {{ t('aboutUs.mission.title') }}
          </h2>
          
          <p class="text-grey-darker text-base sm:text-lg mb-6 sm:mb-8 max-w-xl">
            {{ t('aboutUs.mission.description') }}
          </p>
          
          <NuxtLink
            to="/tours"
            class="inline-flex items-center justify-center w-fit px-8 py-4 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-600 transition-colors duration-300 mb-10 sm:mb-12 uppercase tracking-wide text-sm"
          >
            {{ t('aboutUs.mission.cta') }}
          </NuxtLink>

          <!-- Accordion -->
          <div class="space-y-0 border-l-2 border-grey-normal">
            <div
              v-for="(item, index) in missionItems"
              :key="index"
              class="relative"
            >
              <!-- Active indicator line -->
              <div
                v-if="activeItem === index"
                class="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-dark-normal transition-all duration-300"
              />
              
              <button
                class="w-full text-left px-6 py-4 transition-all duration-300 group"
                @click="toggleItem(index)"
              >
                <div class="flex items-start gap-4">
                  <span
                    class="text-lg font-medium transition-colors duration-300"
                    :class="activeItem === index ? 'text-dark-normal' : 'text-grey-darker'"
                  >
                    {{ formatIndex(index) }}
                  </span>
                  <div class="flex-1">
                    <h3
                      class="text-lg sm:text-xl font-semibold transition-colors duration-300"
                      :class="activeItem === index ? 'text-dark-normal' : 'text-dark-normal'"
                    >
                      {{ item.title }}
                    </h3>
                    
                    <!-- Expandable content -->
                    <div
                      class="overflow-hidden transition-all duration-300 ease-in-out"
                      :class="activeItem === index ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'"
                    >
                      <p class="text-grey-darker text-sm sm:text-base leading-relaxed">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
