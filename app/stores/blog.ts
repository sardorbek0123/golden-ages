import { defineStore } from 'pinia'
import type { Blog, BlogCategory, PaginatedResponse, PaginationParams } from '~/types'

interface BlogsListParams extends PaginationParams {
  category?: number
}

export const useBlogStore = defineStore('blogs', () => {
  const { get } = useApi()

  // State
  const blogs = ref<Blog[]>([])
  const blogCategories = ref<BlogCategory[]>([])
  const currentBlog = ref<Blog | null>(null)
  const count = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasBlogs = computed(() => blogs.value.length > 0)

  const getBlogBySlug = computed(() => (slug: string) => {
    return blogs.value.find(blog => blog.slug === slug)
  })

  const blogsByCategory = computed(() => (categoryId: number) => {
    if (categoryId === 0) return blogs.value
    return blogs.value.filter(blog => blog.category?.id === categoryId)
  })

  // Actions
  async function fetchBlogs(params?: BlogsListParams) {
    loading.value = true
    error.value = null

    try {
      const response = await get<PaginatedResponse<Blog>>('/blogs/', params as Record<string, unknown>)
      blogs.value = response.results
      count.value = response.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch blogs'
      console.error('Error fetching blogs:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchBlogBySlug(slug: string) {
    loadingDetail.value = true
    error.value = null

    try {
      const response = await get<Blog>(`/blogs/${slug}/`)
      currentBlog.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch blog details'
      console.error('Error fetching blog details:', e)
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  async function fetchBlogCategories() {
    try {
      const response = await get<PaginatedResponse<BlogCategory>>('/blog-categories/')
      blogCategories.value = response.results
    } catch (e) {
      console.error('Error fetching blog categories:', e)
      blogCategories.value = []
    }
  }

  function clearCurrentBlog() {
    currentBlog.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    blogs,
    blogCategories,
    currentBlog,
    count,
    loading,
    loadingDetail,
    error,
    // Getters
    hasBlogs,
    getBlogBySlug,
    blogsByCategory,
    // Actions
    fetchBlogs,
    fetchBlogBySlug,
    fetchBlogCategories,
    clearCurrentBlog,
    clearError
  }
})
