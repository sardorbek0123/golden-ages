<script setup lang="ts">
import type { CityDetail } from '~/types/city'

interface Props {
  city: CityDetail
}

const props = defineProps<Props>()
const { t } = useI18n()

const tabs = ['Overview', 'History', 'Highlights', 'Where to stay', 'Tips'] as const
const activeTab = ref(0)

const photos = computed(() => {
  const imgs = props.city.cityimage_set?.map(i => i.image) ?? []
  return imgs.filter(Boolean)
})

const currentPhotoIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (photos.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length
  }, 4000)
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})

const hasHighlights = computed(() => (props.city.experience_highlights?.length ?? 0) > 0)
const highlights = computed(() => props.city.experience_highlights ?? [])

const needsSwiper = computed(() => highlights.value.length > 3)

const highlightsContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateScrollButtons() {
  const el = highlightsContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 2
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 2
}

function scrollHighlights(direction: 'left' | 'right') {
  const el = highlightsContainer.value
  if (!el) return
  const cardWidth = 220
  el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  setTimeout(updateScrollButtons, 350)
}

onMounted(() => {
  nextTick(updateScrollButtons)
})

const infoItems = computed(() => {
  const items: { label: string; value: string }[] = []
  if (props.city.region) items.push({ label: t('cityOverview.region'), value: props.city.region })
  if (props.city.population) items.push({ label: t('cityOverview.population'), value: props.city.population })
  if (props.city.founded) items.push({ label: t('cityOverview.founded'), value: props.city.founded })
  if (props.city.unesco_status) items.push({ label: t('cityOverview.unescoStatus'), value: props.city.unesco_status })
  if (props.city.best_season) items.push({ label: t('cityOverview.bestSeason'), value: props.city.best_season })
  return items
})

function stripHtml(html: string) {
  if (!import.meta.server) {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }
  return html.replace(/<[^>]*>/g, '')
}
</script>

<template>
  <section class="bg-orange-cream py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
    <div class="container mx-auto">
      <!-- Title -->
      <h2
        v-if="city.title"
        class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-dark-normal leading-tight mb-8 sm:mb-10 font-display"
      >
        {{ city.title }}
      </h2>

      <!-- Tabs -->
      <div class="border-b border-dark-light mb-8 sm:mb-10 overflow-x-auto scrollbar-hide">
        <div class="flex gap-6 sm:gap-8 md:gap-10 min-w-max">
          <button
            v-for="(tab, idx) in tabs"
            :key="tab"
            class="pb-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
            :class="[
              activeTab === idx
                ? 'text-dark-normal border-b-2 border-dark-normal'
                : 'text-grey-darker hover:text-dark-normal',
              idx !== 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
            :disabled="idx !== 0"
            @click="activeTab = idx"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Overview Tab Content -->
      <div v-if="activeTab === 0" class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <!-- Left: Info -->
        <div class="w-full lg:w-1/2 flex flex-col justify-between">
          <!-- Subtitle & description -->
          <div class="mb-6 sm:mb-8">
            <h3
              v-if="city.subtitle"
              class="text-xl sm:text-2xl md:text-[1.7rem] font-bold text-dark-normal leading-snug mb-3 sm:mb-4"
            >
              {{ city.subtitle }}
            </h3>

            <template v-if="city.properties?.length">
              <p
                v-for="prop in city.properties"
                :key="prop.id"
                class="text-grey-darker text-sm sm:text-base leading-relaxed"
              >
                {{ stripHtml(prop.value) }}
              </p>
            </template>
          </div>

          <!-- Info Grid -->
          <div v-if="infoItems.length" class="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 sm:gap-y-5">
            <div v-for="item in infoItems" :key="item.label">
              <p class="text-grey-darker text-xs sm:text-sm mb-0.5">{{ item.label }}:</p>
              <p class="text-dark-normal text-sm sm:text-base font-semibold leading-snug">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Image carousel -->
        <div v-if="photos.length" class="w-full lg:w-1/2 h-full">
          <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[240px] sm:h-[300px] md:h-[360px] lg:h-full lg:min-h-[320px]">
            <NuxtImg
              v-for="(photo, idx) in photos"
              :key="photo"
              :src="photo"
              :alt="`${city.name} ${idx + 1}`"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              :class="idx === currentPhotoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
            />
            <!-- Dots -->
            <div v-if="photos.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              <button
                v-for="(_, idx) in photos"
                :key="idx"
                class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all"
                :class="idx === currentPhotoIndex ? 'bg-white scale-110' : 'bg-white/50'"
                @click="currentPhotoIndex = idx"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Highlights -->
      <div v-if="hasHighlights && activeTab === 0" class="mt-10 sm:mt-12 md:mt-14">
        <div class="flex items-center justify-between mb-5 sm:mb-6">
          <h3 class="text-xl sm:text-2xl font-bold text-dark-normal">
            {{ t('cityOverview.experienceHighlights') }}:
          </h3>

          <!-- Scroll arrows (show when overflow) -->
          <div v-if="needsSwiper" class="flex gap-2">
            <button
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-dark-light flex items-center justify-center transition-colors"
              :class="canScrollLeft ? 'hover:bg-dark-light text-dark-normal' : 'text-grey-normal cursor-not-allowed'"
              :disabled="!canScrollLeft"
              @click="scrollHighlights('left')"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-dark-normal bg-dark-normal text-white flex items-center justify-center transition-colors hover:bg-dark-dark"
              :class="{ 'opacity-40 cursor-not-allowed': !canScrollRight }"
              :disabled="!canScrollRight"
              @click="scrollHighlights('right')"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Cards container -->
        <div
          ref="highlightsContainer"
          class="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pb-2"
          :class="needsSwiper ? '' : 'flex-wrap'"
          @scroll="updateScrollButtons"
        >
          <div
            v-for="hl in highlights"
            :key="hl.id"
            class="shrink-0 w-[180px] sm:w-[200px] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-grey-darker"
          >
            <div class="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4">
              <NuxtImg
                :src="hl.icon"
                :alt="hl.title"
                loading="lazy"
                class="w-full h-full object-contain"
              />
            </div>
            <h4 class="text-sm sm:text-base font-bold text-dark-normal mb-1.5 sm:mb-2">{{ hl.title }}</h4>
            <p class="text-grey-darker text-xs sm:text-sm leading-relaxed line-clamp-3">
              {{ stripHtml(hl.description) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
