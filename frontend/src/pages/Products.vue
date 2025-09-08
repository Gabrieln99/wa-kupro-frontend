<template>
  <div class="page-content">
    <Navbar />

    <!-- Breadcrumbs -->
    <Breadcrumb
      :items="breadcrumbItems"
      :category="currentCategory"
      :search-term="currentSearchTerm"
    />

    <div class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <h2>{{ pageTitle }}</h2>
        <p v-if="pageDescription" class="page-description">{{ pageDescription }}</p>
      </div>

      <!-- Search and Filters -->
      <ProductFilters
        :filters="filters"
        :total-results="products.length"
        @update:filters="updateFilters"
        @search="handleSearch"
      />

      <!-- Notification for successful actions -->
      <div v-if="notification.message" class="notification" :class="notification.type">
        <i :class="notification.icon"></i>
        <span>{{ notification.message }}</span>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <span>Učitavanje proizvoda...</span>
      </div>

      <!-- No results message -->
      <div v-else-if="products.length === 0" class="no-results">
        <i class="pi pi-search no-results-icon"></i>
        <h3>Nema rezultata</h3>
        <p v-if="hasActiveFilters">Pokušajte s drugačijim filterima ili pretraživanjem.</p>
        <p v-else>Trenutno nema dostupnih proizvoda.</p>
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-filters-btn">
          <i class="pi pi-refresh"></i>
          Obriši filtere
        </button>
      </div>

      <!-- Products grid -->
      <div v-else class="products-grid">
        <Card
          v-for="product in products"
          :key="product.id"
          :name="product.name"
          :current-price="product.currentPrice"
          :original-price="product.originalPrice"
          :image="product.image"
          :is-bidding="product.isBidding || product.biddingEnabled"
          :bidding-status="product.biddingStatus"
          :time-remaining="product.timeRemaining"
          :bid-count="product.bidCount"
          :best-bidder="product.bestBidder"
          :category="product.category"
          @add-to-cart="handleAddToCart(product)"
          @place-bid="handlePlaceBid(product, $event)"
          @view-product="handleViewProduct(product)"
        />
      </div>

      <!-- Load More Button (for pagination) -->
      <div v-if="canLoadMore" class="load-more-section">
        <button @click="loadMore" class="load-more-btn" :disabled="loadingMore">
          <i class="pi" :class="loadingMore ? 'pi-spin pi-spinner' : 'pi-plus'"></i>
          {{ loadingMore ? 'Učitavanje...' : 'Učitaj više' }}
        </button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { productService } from '@/services/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Card from '@/components/Card.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ProductFilters from '@/components/ProductFilters.vue'

// Props from route
const props = defineProps({
  category: String,
  search: String,
  bidding: String,
})

// Router and auth
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive data
const products = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const canLoadMore = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

// Filters state
const filters = reactive({
  searchTerm: '',
  category: '',
  priceRange: { min: null, max: null },
  biddingStatus: 'all',
  sortBy: 'newest',
})

// Notification state
const notification = reactive({
  message: '',
  type: '',
  icon: '',
})

// Computed properties
const currentCategory = computed(() => {
  return props.category || route.query.category || filters.category
})

const currentSearchTerm = computed(() => {
  return props.search || route.query.search || filters.searchTerm
})

const pageTitle = computed(() => {
  if (currentSearchTerm.value) {
    return `Rezultati pretrage: "${currentSearchTerm.value}"`
  }
  if (currentCategory.value) {
    return currentCategory.value
  }
  return 'Svi proizvodi'
})

const pageDescription = computed(() => {
  if (currentCategory.value) {
    return `Pregledajte sve proizvode u kategoriji ${currentCategory.value}`
  }
  if (currentSearchTerm.value) {
    return `Pronađeni proizvodi za pretraživanje "${currentSearchTerm.value}"`
  }
  return 'Pregledajte sve dostupne proizvode i licitacije'
})

const breadcrumbItems = computed(() => {
  const items = [
    {
      label: 'Proizvodi',
      to: { name: 'Products' },
    },
  ]

  return items
})

const hasActiveFilters = computed(() => {
  return (
    filters.category ||
    filters.priceRange.min ||
    filters.priceRange.max ||
    filters.biddingStatus !== 'all' ||
    filters.sortBy !== 'newest' ||
    filters.searchTerm
  )
})

// Methods
const fetchProducts = async (reset = true) => {
  try {
    if (reset) {
      loading.value = true
      currentPage.value = 1
    } else {
      loadingMore.value = true
    }

    // Prepare API parameters
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
    }

    if (filters.searchTerm) params.searchTerm = filters.searchTerm
    if (filters.category) params.category = filters.category
    if (filters.priceRange.min) params.priceMin = filters.priceRange.min
    if (filters.priceRange.max) params.priceMax = filters.priceRange.max
    if (filters.biddingStatus !== 'all') params.biddingStatus = filters.biddingStatus
    if (filters.sortBy) params.sortBy = filters.sortBy

    const response = await productService.getProducts(params)

    // Handle new API response format
    const responseData = response.data
    const productsData = responseData.products || responseData || []

    if (reset) {
      products.value = productsData.map((product) => ({
        ...product,
        id: product._id || product.id,
      }))
    } else {
      const newProducts = productsData.map((product) => ({
        ...product,
        id: product._id || product.id,
      }))
      products.value.push(...newProducts)
    }

    // Update pagination info from response
    if (responseData.pagination) {
      canLoadMore.value = responseData.pagination.hasNextPage
    } else {
      // Fallback: assume more pages if we got full page of results
      canLoadMore.value = productsData.length === itemsPerPage
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    showNotification('Greška pri dohvaćanju proizvoda', 'error', 'pi-exclamation-triangle')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!loadingMore.value && canLoadMore.value) {
    currentPage.value++
    fetchProducts(false)
  }
}

const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters)
  updateRouteQuery()
  fetchProducts()
}

const handleSearch = (searchFilters) => {
  Object.assign(filters, searchFilters)
  updateRouteQuery()
  fetchProducts()
}

const updateRouteQuery = () => {
  const query = {}

  if (filters.searchTerm) query.search = filters.searchTerm
  if (filters.category) query.category = filters.category
  if (filters.biddingStatus !== 'all') query.bidding = filters.biddingStatus

  // Update route without causing navigation
  if (JSON.stringify(query) !== JSON.stringify(route.query)) {
    router.replace({ name: 'Products', query })
  }
}

const clearAllFilters = () => {
  filters.searchTerm = ''
  filters.category = ''
  filters.priceRange.min = null
  filters.priceRange.max = null
  filters.biddingStatus = 'all'
  filters.sortBy = 'newest'

  router.replace({ name: 'Products' })
  fetchProducts()
}

const initializeFiltersFromRoute = () => {
  // Initialize filters from route props and query
  if (props.category || route.query.category) {
    filters.category = props.category || route.query.category
  }
  if (props.search || route.query.search) {
    filters.searchTerm = props.search || route.query.search
  }
  if (props.bidding || route.query.bidding) {
    filters.biddingStatus = props.bidding || route.query.bidding
  }
}

const showNotification = (message, type = 'success', icon = 'pi-check') => {
  notification.message = message
  notification.type = type
  notification.icon = icon

  setTimeout(() => {
    notification.message = ''
    notification.type = ''
    notification.icon = ''
  }, 5000)
}

const handleAddToCart = (product) => {
  if (!authStore.isAuthenticated) {
    showNotification(
      'Morate se prijaviti za dodavanje u košaricu',
      'error',
      'pi-exclamation-triangle',
    )
    router.push('/login')
    return
  }

  // Add to cart logic here
  showNotification(`${product.name} je dodan u košaricu`, 'success', 'pi-shopping-cart')
}

const handlePlaceBid = async (product, bidData) => {
  if (!authStore.isAuthenticated) {
    showNotification('Morate se prijaviti za licitiranje', 'error', 'pi-exclamation-triangle')
    router.push('/login')
    return
  }

  try {
    const response = await productService.placeBid(product.id, bidData)
    showNotification(response.data.message, 'success', 'pi-check')

    // Refresh products to show updated bid info
    fetchProducts()
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Greška pri stavljanju ponude'
    showNotification(errorMessage, 'error', 'pi-exclamation-triangle')
  }
}

const handleViewProduct = (product) => {
  router.push(`/products/${product.id}`)
}

// Watch for route changes
watch(
  () => route.query,
  () => {
    initializeFiltersFromRoute()
    fetchProducts()
  },
  { deep: true },
)

// Initialize on mount
onMounted(() => {
  initializeFiltersFromRoute()
  fetchProducts()
})
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  color: #2a5298;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 15px;
}

.loading-icon {
  font-size: 3rem;
  color: #2a5298;
}

.loading-container span {
  color: #666;
  font-size: 1.1rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.no-results-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.no-results h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.clear-filters-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.clear-filters-btn:hover {
  background: #0056b3;
}

/* Notification */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.notification i {
  font-size: 1.125rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* Load More */
.load-more-section {
  text-align: center;
  margin-top: 3rem;
}

.load-more-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #0056b3;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .notification {
    right: 0.5rem;
    left: 0.5rem;
    padding: 0.875rem 1.25rem;
  }
}
</style>
