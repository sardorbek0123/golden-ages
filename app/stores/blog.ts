import { defineStore } from 'pinia'
import type { Blog, BlogCategory, PaginatedResponse, PaginationParams } from '~/types'

export const useBlogStore = defineStore('blogs', () => {
  const { get } = useApi()

  // State
  const blogs = ref<Blog[]>([])
  const blogCategories = ref<BlogCategory[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)


  const hasBlogs = computed(() => blogs.value.length > 0)

  // Actions
  async function fetchBlogs(params?: PaginationParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<Blog>>('/blogs/', params)
      blogs.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch blogs'
      console.error('Error fetching blogs:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchBlogCategories() {
    try {
      const response = await get<PaginatedResponse<BlogCategory>>('/blog-categories/')
      return response.results
    } catch (e) {
      console.error('Error fetching blog categories:', e)
      return []
    }
  }

  return {
    // State
    blogs,
    blogCategories,
    count,
    loading,
    error,
    // Getters
    hasBlogs,
    // Actions
    fetchBlogs,
    fetchBlogCategories
  }
})
