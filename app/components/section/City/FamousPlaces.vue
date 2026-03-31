<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

interface Props {
  cityId: number;
}

const props = defineProps<Props>();
const { t } = useI18n();
const citiesStore = useCitiesStore();
const { famousPlaces, loadingFamousPlaces } = storeToRefs(citiesStore);

const activeItem = ref<number | null>(0);

// Fetch famous places on mount
onMounted(async () => {
  await citiesStore.fetchFamousPlaces(props.cityId);
});

watch(
  () => props.cityId,
  async (newCityId) => {
    if (newCityId) {
      activeItem.value = null;
      await citiesStore.fetchFamousPlaces(newCityId);
      activeItem.value = famousPlaces.value.length > 0 ? 0 : null;
    }
  },
);

// Images of the currently active place only
const sliderImages = computed(() => {
  const idx = activeItem.value;
  if (idx === null || idx < 0 || idx >= famousPlaces.value.length) {
    // Fallback to first place when none selected
    const place = famousPlaces.value[0];
    if (!place) return [];
    return place.images.map((img) => ({ url: img.image, alt: place.name }));
  }
  const place = famousPlaces.value[idx];
  return place.images.map((img) => ({ url: img.image, alt: place.name }));
});

const hasImages = computed(() => sliderImages.value.length > 0);

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

const toggleItem = (index: number) => {
  activeItem.value = activeItem.value === index ? null : index;
};
</script>

<template>
  <section class="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-white">
    <div class="container mx-auto">
      <div
        class="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-stretch"
      >
        <!-- Left: Image Slider -->
        <div class="w-full lg:w-1/2 xl:w-[45%]">
          <div
            class="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden"
          >
            <!-- Loading -->
            <div
              v-if="loadingFamousPlaces"
              class="absolute inset-0 flex items-center justify-center bg-grey-normal/10"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-2 border-orange-normal border-t-transparent"
              />
            </div>

            <!-- Empty state: placeholder -->
            <div
              v-else-if="!hasImages && famousPlaces.length === 0"
              class="w-full h-full bg-grey-normal/20 flex items-center justify-center"
            >
              <p class="text-grey-darker text-sm">
                {{ t("cities.famousPlaces.title") }}
              </p>
            </div>

            <!-- Slider with images -->
            <Swiper
              v-else-if="hasImages"
              :key="activeItem ?? -1"
              :modules="[Autoplay]"
              :slides-per-view="1"
              :space-between="0"
              :loop="sliderImages.length > 1"
              :autoplay="{
                delay: 4000,
                disableOnInteraction: false,
              }"
              class="famous-places-swiper w-full h-full"
            >
              <SwiperSlide
                v-for="(img, idx) in sliderImages"
                :key="idx"
                class="w-full h-full"
              >
                <img
                  :src="img.url"
                  :alt="img.alt"
                  width="1200"
                  height="800"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            </Swiper>

            <!-- No images but has places - show grey placeholder -->
            <div
              v-else
              class="w-full h-full bg-grey-normal/20 flex items-center justify-center"
            >
              <p class="text-grey-darker text-sm">
                {{ t("cities.famousPlaces.title") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="w-full lg:w-1/2 xl:w-[55%] flex flex-col justify-center">
          <h2
            class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-dark-normal leading-tight mb-6 sm:mb-8 font-display"
          >
            {{ t("cities.famousPlaces.title") }}
          </h2>

          <!-- Loading -->
          <div v-if="loadingFamousPlaces" class="space-y-2">
            <div
              v-for="i in 3"
              :key="i"
              class="h-12 bg-grey-normal/20 rounded animate-pulse"
            />
          </div>

          <!-- Empty -->
          <p v-else-if="famousPlaces.length === 0" class="text-grey-darker">
            {{ t("cities.famousPlaces.noPlaces") }}
          </p>

          <!-- Accordion -->
          <div v-else class="space-y-0 border-l-2 border-grey-normal">
            <div
              v-for="(place, index) in famousPlaces"
              :key="place.id"
              class="relative"
            >
              <!-- Active indicator line -->
              <div
                v-if="activeItem === index"
                class="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-dark-normal transition-all duration-300"
              />

              <button
                class="w-full text-left px-1.5 md:px-6 py-1 md:py-4 transition-all duration-300 group"
                @click="toggleItem(index)"
              >
                <div class="flex items-start gap-4">
                  <span
                    class="text-lg font-medium transition-colors duration-300"
                    :class="
                      activeItem === index
                        ? 'text-dark-normal'
                        : 'text-grey-darker'
                    "
                  >
                    {{ formatIndex(index) }}
                  </span>
                  <div class="flex-1">
                    <h3
                      class="text-base sm:text-xl font-semibold transition-colors duration-300 text-dark-normal"
                    >
                      {{ place.name }}
                    </h3>

                    <!-- Expandable content -->
                    <div
                      class="overflow-hidden transition-all duration-300 ease-in-out"
                      :class="
                        activeItem === index
                          ? 'max-h-[500px] opacity-100 mt-3'
                          : 'max-h-0 opacity-0'
                      "
                    >
                      <div
                        class="text-grey-darker [&]:text-sm! **:text-sm! sm:[&]:text-base! sm:**:text-base! leading-relaxed prose prose-sm max-w-none"
                        v-html="place.description"
                      />
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

<style scoped>
.famous-places-swiper {
  border-radius: 1rem;
}
</style>
