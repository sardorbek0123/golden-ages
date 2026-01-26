<script setup lang="ts">
const { t } = useI18n()

</script>
<template>
    <section class="container mx-auto py-10 sm:py-14 md:py-16 lg:py-20 xl:py-30 px-4 sm:px-6">
        <div
            class="relative bg-cover bg-center bg-no-repeat bg-[url('@/assets/images/culture.jpg')] min-h-[250px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center">
            <div class="absolute inset-0 bg-black/50 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
            <div class="container relative mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center leading-tight">{{ t('culture.heroTitle') }}</h1>
            </div>
        </div>
    </section>
</template>