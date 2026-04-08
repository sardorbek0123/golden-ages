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
  <div class="mt-10 sm:mt-12 w-full max-w-sm md:max-w-[380px] translate-y-20">
    <div
      v-if="leadSubmitted"
      class="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center text-white backdrop-blur-sm"
    >
      <p class="text-base sm:text-lg font-semibold">
        {{ t('hero.leadForm.successTitle') }}
      </p>
      <p class="mt-1.5 text-xs sm:text-sm text-white/90 leading-relaxed">
        {{ t('hero.leadForm.successMessage') }}
      </p>
    </div>

    <form
      v-else
      class="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 sm:px-4 sm:py-4 backdrop-blur-sm space-y-2.5 sm:space-y-3"
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
          class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
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
          class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
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
          class="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-orange-normal"
        />
      </div>

      <p v-if="messagesStore.error" class="text-center text-xs text-red-300">
        {{ messagesStore.error }}
      </p>

      <button
        type="submit"
        :disabled="isLeadSubmitting || !isLeadValid"
        class="w-full rounded-full bg-orange-normal py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span v-if="isLeadSubmitting">{{ t('hero.leadForm.sending') }}</span>
        <span v-else>{{ t('hero.leadForm.submit') }}</span>
      </button>
    </form>
  </div>
</template>
