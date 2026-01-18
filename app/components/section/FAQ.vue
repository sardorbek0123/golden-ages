<script setup lang="ts">
const { t } = useI18n()
const faqsStore = useFaqsStore()
const { faqs, loading } = storeToRefs(faqsStore)

// Track which FAQ is expanded
const expandedId = ref<number | null>(null)

onMounted(async () => {
  if (!faqsStore.hasFaqs) {
    await faqsStore.fetchFaqs()
  }
  // Expand first FAQ by default
  if (faqs.value.length > 0) {
    expandedId.value = faqs.value[0].id
  }
})

const toggleFaq = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const isExpanded = (id: number) => expandedId.value === id
</script>

<template>
  <section class="py-16 md:py-20 px-4">
    <div class="container mx-auto">
      <div class="bg-[#F9FAF9] rounded-2xl p-6 md:p-10 lg:p-16">
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <!-- Left Column - Title and CTA -->
          <div class="lg:w-1/3">
            <h2 class="text-3xl md:text-4xl font-bold text-dark-normal mb-4">
              {{ t('faq.title') }}
            </h2>
            <p class="text-grey-darker mb-8">
              {{ t('faq.description') }}
            </p>
            <NuxtLink
              to="/contacts#form"
              class="inline-flex items-center justify-center px-8 py-4 bg-orange-normal hover:bg-orange-normal-hover text-white font-medium text-sm uppercase tracking-wide rounded-full transition-colors"
            >
              {{ t('faq.askQuestion') }}
            </NuxtLink>
          </div>

          <!-- Right Column - FAQ Accordion -->
          <div class="lg:w-2/3">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-16">
              <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-normal border-t-transparent" />
            </div>

            <!-- FAQ List -->
            <div v-else class="space-y-4">
              <div
                v-for="faq in faqs"
                :key="faq.id"
                class="bg-white rounded-xl overflow-hidden"
              >
                <!-- Question Header -->
                <button
                  class="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  @click="toggleFaq(faq.id)"
                >
                  <span class="text-dark-normal font-medium pr-4">
                    {{ faq.question }}
                  </span>
                  <span
                    class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-orange-normal transition-transform duration-300"
                    :class="{ 'rotate-45': isExpanded(faq.id) }"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </button>

                <!-- Answer Content -->
                <Transition name="accordion">
                  <div v-if="isExpanded(faq.id)" class="overflow-hidden">
                    <div class="px-5 md:px-6 pb-5 md:pb-6">
                      <p class="text-grey-darker leading-relaxed">
                        {{ faq.answer }}
                      </p>
                    </div>
                  </div>
                </Transition>
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
  max-height: 500px;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
