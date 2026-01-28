<script setup lang="ts">
import BuildingIcon from '~/components/icons/building.vue'
import SimCardIcon from '~/components/icons/sim-card.vue'
import HeartBeatIcon from '~/components/icons/heart-beat.vue'
import BadgeIcon from '~/components/icons/badge.vue'
import PlaneIcon from '~/components/icons/plane.vue'
import CommentsIcon from '~/components/icons/comments.vue'
import whyUsImage from '~/assets/images/why_us.jpg'
const { t } = useI18n()
const features = [
  {
    icon: BuildingIcon,
    title: t('whyChooseUs.hotels.title'),
    description: t('whyChooseUs.hotels.description')
  },
  {
    icon: SimCardIcon,
    title: 'Free SIM card / eSIM',
    description: t('whyChooseUs.simCard.description')
  },
  {
    icon: HeartBeatIcon,
    title: t('whyChooseUs.medical.title'),
    description: t('whyChooseUs.medical.description')
  },
  {
    icon: BadgeIcon,
    title: t('whyChooseUs.guides.title'),
    description: t('whyChooseUs.guides.description')
  },
  {
    icon: PlaneIcon,
    title: t('whyChooseUs.packages.title'),
    description: t('whyChooseUs.packages.description')
  },
  {
    icon: CommentsIcon,
    title: t('whyChooseUs.support.title'),
    description: t('whyChooseUs.support.description')
  }
]

const leftFeatures = features.slice(0, 3)
const rightFeatures = features.slice(3, 6)
</script>

<template>
  <section class="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto bg-[#F9FAF9] border border-[#9195923D] py-10 sm:py-14 md:py-16 lg:py-20 px-5 sm:px-6 md:px-8 lg:px-10 rounded-2xl sm:rounded-3xl">
      <!-- Header -->
      <div class="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
        <!-- Badge -->
        <CommonBadge :text="t('whyChooseUs.badge')" />
        
        <!-- Title -->
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
          {{ t('whyChooseUs.title') }}
        </h2>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        <!-- Left Column - Feature Cards -->
        <div class="lg:col-span-4 flex flex-col gap-3 sm:gap-4 md:gap-5 order-2 lg:order-1">
          <CardsFeatureCard
            v-for="(feature, index) in leftFeatures"
            :key="index"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </div>

        <!-- Center - Image -->
        <div class="flex justify-center h-full order-1 lg:order-2 md:col-span-2 lg:col-span-4">
          <NuxtImg
            :src="whyUsImage"
            alt="Why choose us"
            class="w-full max-w-md lg:max-w-none rounded-xl sm:rounded-2xl object-cover aspect-4/3 lg:aspect-auto"
            loading="lazy"
          />
        </div>

        <!-- Right Column - Feature Cards -->
        <div class="lg:col-span-4 flex flex-col gap-3 sm:gap-4 md:gap-5 order-3">
          <CardsFeatureCard
            v-for="(feature, index) in rightFeatures"
            :key="index"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </div>
      </div>
    </div>
  </section>
</template>
