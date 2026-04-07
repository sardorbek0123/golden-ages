<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMessagesStore } from '~/stores/messages'

const { t } = useI18n()
const localePath = useLocalePath()
const messagesStore = useMessagesStore()

const form = reactive({
  fullName: '',
  email: '',
  phone: ''
})

const dataProcessingConsent = ref(true)
const leadSubmitted = ref(false)

const isLeadValid = computed(
  () =>
    form.fullName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    dataProcessingConsent.value
)

const isLeadSubmitting = computed(() => messagesStore.leadLoading)

const handleLeadSubmit = async () => {
  if (!isLeadValid.value) return

  messagesStore.clearError()

  const ok = await messagesStore.createLeadMessage({
    full_name: form.fullName,
    email: form.email,
    phone: form.phone
  })

  if (ok) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17928071140/8L06CK_DgIccEOTP4uRC',
        value: 1.0,
        currency: 'USD'
      })
    }

    leadSubmitted.value = true
    form.fullName = ''
    form.email = ''
    form.phone = ''
    dataProcessingConsent.value = true
  }
}
</script>

<template>
  <section class="relative bg-cover bg-center min-h-svh md:h-screen">
    <!-- Background Image -->
    <NuxtImg
      src="/images/hero_bg.jpg"
      alt="Hero Background"
      width="1920"
      height="1220"
      sizes="100vw"
      format="webp"
      preload
      fetchpriority="high"
      class="absolute inset-0 h-full w-full object-cover"
    />

    <!-- Dark Overlay (70% black) -->
    <div class="absolute inset-0 bg-black/70"></div>

    <!-- Content -->
    <div class="relative container mx-auto h-full px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-center gap-3 sm:gap-4 h-full py-40 sm:py-20 md:py-0">
        <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-medium text-white text-center leading-tight">
          {{ t('hero.title') }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          {{ t('hero.subtitle') }}
        </p>
        <div class="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <NuxtLink
            :to="localePath('/tours')"
            class="w-full sm:w-auto text-center px-5 sm:px-6 py-2 sm:py-3 bg-transparent text-white text-xs sm:text-sm font-semibold border border-gray-50 hover:border-orange-normal rounded-full transition-colors uppercase tracking-wide"
          >
            {{ t('hero.exploreTours') }}
          </NuxtLink>
          <NuxtLink
            to="#form"
            class="w-full sm:w-auto text-center px-5 sm:px-6 py-2 sm:py-3 bg-orange-normal hover:bg-orange-400 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors uppercase tracking-wide"
          >
            {{ t('hero.ctaText') }}
          </NuxtLink>
        </div>

        <!-- Quick lead -->
        <div class="mt-6 sm:mt-8 w-full max-w-md">
          <div
            v-if="leadSubmitted"
            class="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-center text-white backdrop-blur-sm"
          >
            <p class="text-lg sm:text-xl font-semibold">
              {{ t('hero.leadForm.successTitle') }}
            </p>
            <p class="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
              {{ t('hero.leadForm.successMessage') }}
            </p>
          </div>

          <form
            v-else
            class="rounded-2xl border border-white/20 bg-white/10 px-4 py-5 sm:px-5 sm:py-6 backdrop-blur-sm space-y-3 sm:space-y-4"
            @submit.prevent="handleLeadSubmit"
          >
            <p class="text-center text-xs sm:text-sm font-medium uppercase tracking-wide text-white/90">
              {{ t('hero.leadForm.title') }}
            </p>

            <div>
              <label for="hero-lead-name" class="mb-1 block text-[10px] uppercase tracking-wide text-white/70">
                {{ t('contactForm.fullName') }}
              </label>
              <input
                id="hero-lead-name"
                v-model="form.fullName"
                type="text"
                required
                autocomplete="name"
                :placeholder="t('contactForm.fullName')"
                class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
              />
            </div>

            <div>
              <label for="hero-lead-email" class="mb-1 block text-[10px] uppercase tracking-wide text-white/70">
                {{ t('contactForm.email') }}
              </label>
              <input
                id="hero-lead-email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                :placeholder="t('contactForm.email')"
                class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
              />
            </div>

            <div>
              <label for="hero-lead-phone" class="mb-1 block text-[10px] uppercase tracking-wide text-white/70">
                {{ t('contactForm.phone') }}
              </label>
              <input
                id="hero-lead-phone"
                v-model="form.phone"
                type="tel"
                required
                autocomplete="tel"
                :placeholder="t('contactForm.phone')"
                class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
              />
            </div>

            <div class="space-y-2 pt-1">
              <p class="text-[10px] sm:text-[11px] text-white/60 leading-snug">
                {{ t('common.dataConsentHint') }}
              </p>
              <label class="flex cursor-pointer items-start gap-2.5 select-none">
                <input
                  v-model="dataProcessingConsent"
                  type="checkbox"
                  class="mt-0.5 size-4 shrink-0 rounded border-white/40 bg-white/10 text-orange-normal focus:ring-orange-normal"
                />
                <span class="text-[10px] sm:text-[11px] text-white/80 leading-snug">
                  <i18n-t keypath="common.dataConsent" tag="span">
                    <template #offer>
                      <NuxtLink
                        :to="localePath('/public_offer')"
                        class="text-orange-300 underline underline-offset-2 hover:text-orange-200"
                      >
                        {{ t('common.publicOffer') }}
                      </NuxtLink>
                    </template>
                  </i18n-t>
                </span>
              </label>
            </div>

            <p v-if="messagesStore.error" class="text-center text-xs text-red-300">
              {{ messagesStore.error }}
            </p>

            <button
              type="submit"
              :disabled="isLeadSubmitting || !isLeadValid"
              class="w-full rounded-full bg-orange-normal py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span v-if="isLeadSubmitting">{{ t('hero.leadForm.sending') }}</span>
              <span v-else>{{ t('hero.leadForm.submit') }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
