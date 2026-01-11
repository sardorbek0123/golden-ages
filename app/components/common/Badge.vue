<script setup lang="ts">
defineProps<{
    text: string
    color?: string
}>()
</script>
<template>
    <div class="inline-flex items-center px-4 py-1.5 rounded-full border border-orange-normal mb-6" :class="color">
        <span class="text-sm font-medium text-orange-normal uppercase tracking-wide">
        {{ text }}
        </span>
    </div>
</template>