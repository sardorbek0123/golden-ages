<script setup lang="ts">
const { t } = useI18n()
const blogStore = useBlogStore()

const activeCategory = ref<number>(0)

const toggleCategory = (categoryId: number) => {
  activeCategory.value = categoryId
}

const categories = computed(() => {
  const allCategory = {
    id: 0,
    name: t('all'),
  }
  const apiCategories = blogStore.blogCategories.map(category => ({
    id: category.id,
    name: category.name
  }))

  return [allCategory, ...apiCategories]
})
</script>
<template>
  <div class="flex justify-center items-center gap-4">
    <div v-for="category in categories" :key="category.id">
      <button class="font-bold text-2xl" :class=" activeCategory === category.id ? 'text-black' : 'text-black/40' " @click="toggleCategory(category.id)">
        {{ category.name}}
      </button>
    </div>
  </div>
</template>