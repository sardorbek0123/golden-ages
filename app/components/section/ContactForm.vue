<script setup lang="ts">
import contactBg from '~/assets/images/hero_bg.jpg'
import { useTripsStore } from '~/stores/trips'
import { useMessagesStore } from '~/stores/messages'

const { t } = useI18n()
const tripsStore = useTripsStore()
const messagesStore = useMessagesStore()

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  tripId: null as number | null,
  message: ''
})

// Fetch trips on mount
onMounted(() => {
  if (!tripsStore.hasTrips) {
    tripsStore.fetchTrips()
  }
})

const isSubmitting = computed(() => messagesStore.loading)

const handleSubmit = async () => {
  if (!form.tripId) return

  const success = await messagesStore.createMessage({
    full_name: form.fullName,
    email: form.email,
    phone: form.phone,
    trip_category: form.tripId,
    message: form.message
  })

  if (success) {
    // Reset form on success
    form.fullName = ''
    form.email = ''
    form.phone = ''
    form.tripId = null
    form.message = ''
  }
}
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left - Form -->
        <div class="bg-white rounded-3xl p-10 border border-gray-200">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">{{ t('contactForm.title') }}</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Full Name -->
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                {{ t('contactForm.fullName') }}
              </label>
              <input
                v-model="form.fullName"
                type="text"
                :placeholder="t('contactForm.fullName')"
                class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 outline-none transition-colors bg-transparent text-gray-900 placeholder:text-gray-400"
                :aria-label="t('contactForm.fullName')"
              />
            </div>

            <!-- Email & Phone -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                  {{ t('contactForm.email') }}
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('contactForm.email')"
                  :aria-label="t('contactForm.email')"
                  class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 outline-none transition-colors bg-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                  {{ t('contactForm.phone') }}
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  :placeholder="t('contactForm.phone')"
                  :aria-label="t('contactForm.phone')"
                  class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 outline-none transition-colors bg-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <!-- Tour Type -->
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                {{ t('contactForm.tourType') }}
              </label>
              <select
                v-model="form.tripId"
                class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 outline-none transition-colors bg-transparent text-gray-900 appearance-none cursor-pointer"
                :disabled="tripsStore.loading"
              >
                <option :value="null" disabled>{{ t('contactForm.selectTourType') }}</option>
                <option v-for="trip in tripsStore.trips" :key="trip.id" :value="trip.id">
                  {{ trip.name }}
                </option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                {{ t('contactForm.message') }}
              </label>
              <textarea
                v-model="form.message"
                rows="6"
                :placeholder="t('contactForm.message')"
                :aria-label="t('contactForm.message')"
                class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 outline-none transition-colors bg-transparent text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>

            <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting || !form.tripId"
                class="w-full py-4 bg-orange-normal text-white font-semibold rounded-full hover:bg-orange-normal-hover transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting">{{ t('contactForm.sending') || 'Sending...' }}</span>
                <span v-else>{{ t('contactForm.submit') }}</span>
              </button>
              
              <!-- Success Message -->
              <p v-if="messagesStore.success" class="text-green-600 text-center font-medium">
                {{ t('contactForm.successMessage') || 'Message sent successfully!' }}
              </p>
              
              <!-- Error Message -->
              <p v-if="messagesStore.error" class="text-red-600 text-center font-medium">
                {{ messagesStore.error }}
              </p>
          </form>
        </div>

        <!-- Right - Contact Info Card -->
        <div 
          class="relative rounded-3xl overflow-hidden min-h-[600px] flex flex-col justify-between p-10"
        >
          <!-- Background Image -->
          <div 
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${contactBg})` }"
          />
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

          <!-- Content -->
          <div class="relative z-10">
            <h3 class="text-4xl font-bold text-white leading-tight">
              {{ t('contactForm.planYourTrip') }}<br />
              {{ t('contactForm.tripWith') }} <span class="text-orange-normal">{{ t('contactForm.localExperts') }}</span>
            </h3>
          </div>

          <!-- Contact Info -->
          <div class="relative z-10 space-y-2">
            <a 
              href="mailto:info@gaou.travel" 
              class="block text-xl text-white/80 hover:text-white transition-colors"
            >
              {{ t('contactForm.email') }}
            </a>
            <a 
              href="tel:+998944448844" 
              class="block text-2xl font-semibold text-white hover:text-orange-normal transition-colors"
            >
              +998(94)444-88-44
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>