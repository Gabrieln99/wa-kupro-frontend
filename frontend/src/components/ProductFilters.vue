<template>
  <div class="search-filters">
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-bar">
        <i class="pi pi-search search-icon"></i>
        <input
          v-model="localFilters.searchTerm"
          type="text"
          placeholder="Pretraži proizvode..."
          class="search-input"
          @keyup.enter="applyFilters"
        />
        <button
          v-if="localFilters.searchTerm"
          @click="clearSearch"
          class="clear-search-btn"
          type="button"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <button @click="applyFilters" class="search-btn">
        <i class="pi pi-search"></i>
        Pretraži
      </button>
    </div>

    <!-- Filter Toggles -->
    <div class="filter-toggles">
      <button
        @click="showFilters = !showFilters"
        class="filter-toggle-btn"
        :class="{ active: showFilters }"
      >
        <i class="pi pi-filter"></i>
        Filteri
        <i class="pi" :class="showFilters ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
      </button>

      <div class="active-filters" v-if="hasActiveFilters">
        <span class="active-filters-label">Aktivni filteri:</span>
        <div class="filter-tags">
          <span v-if="localFilters.category" class="filter-tag">
            {{ localFilters.category }}
            <button @click="clearFilter('category')" class="remove-filter">
              <i class="pi pi-times"></i>
            </button>
          </span>
          <span
            v-if="localFilters.priceRange.min || localFilters.priceRange.max"
            class="filter-tag"
          >
            {{ formatPriceRange }}
            <button @click="clearFilter('price')" class="remove-filter">
              <i class="pi pi-times"></i>
            </button>
          </span>
          <span v-if="localFilters.biddingStatus !== 'all'" class="filter-tag">
            {{ biddingStatusLabel }}
            <button @click="clearFilter('bidding')" class="remove-filter">
              <i class="pi pi-times"></i>
            </button>
          </span>
          <span v-if="localFilters.sortBy !== 'newest'" class="filter-tag">
            {{ sortByLabel }}
            <button @click="clearFilter('sort')" class="remove-filter">
              <i class="pi pi-times"></i>
            </button>
          </span>
        </div>
        <button @click="clearAllFilters" class="clear-all-btn">Obriši sve</button>
      </div>
    </div>

    <!-- Filter Panel -->
    <div v-show="showFilters" class="filter-panel">
      <div class="filter-grid">
        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Kategorija</label>
          <select v-model="localFilters.category" class="filter-select">
            <option value="">Sve kategorije</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Cijena (€)</label>
          <div class="price-range">
            <input
              v-model.number="localFilters.priceRange.min"
              type="number"
              placeholder="Od"
              min="0"
              class="price-input"
            />
            <span class="price-separator">-</span>
            <input
              v-model.number="localFilters.priceRange.max"
              type="number"
              placeholder="Do"
              min="0"
              class="price-input"
            />
          </div>
        </div>

        <!-- Bidding Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select v-model="localFilters.biddingStatus" class="filter-select">
            <option value="all">Svi proizvodi</option>
            <option value="bidding">Samo licitacije</option>
            <option value="regular">Običai proizvodi</option>
            <option value="active">Aktivne licitacije</option>
            <option value="ended">Završene licitacije</option>
          </select>
        </div>

        <!-- Sort By Filter -->
        <div class="filter-group">
          <label class="filter-label">Sortiraj po</label>
          <select v-model="localFilters.sortBy" class="filter-select">
            <option value="newest">Najnovije</option>
            <option value="oldest">Najstarije</option>
            <option value="price-low">Cijena: najniža</option>
            <option value="price-high">Cijena: najviša</option>
            <option value="name-asc">Naziv: A-Z</option>
            <option value="name-desc">Naziv: Z-A</option>
            <option value="most-bids">Najviše ponuda</option>
            <option value="ending-soon">Završava uskoro</option>
          </select>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="filter-actions">
        <button @click="applyFilters" class="apply-filters-btn">
          <i class="pi pi-check"></i>
          Primijeni filtere
        </button>
        <button @click="resetFilters" class="reset-filters-btn">
          <i class="pi pi-refresh"></i>
          Resetiraj
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      <span class="results-count">
        <i class="pi pi-list"></i>
        {{ totalResults }}
        {{ totalResults === 1 ? 'proizvod' : totalResults < 5 ? 'proizvoda' : 'proizvoda' }}
      </span>
      <span v-if="localFilters.searchTerm" class="search-term">
        za "{{ localFilters.searchTerm }}"
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      searchTerm: '',
      category: '',
      priceRange: { min: null, max: null },
      biddingStatus: 'all',
      sortBy: 'newest',
    }),
  },
  totalResults: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:filters', 'search'])

// Local filter state
const localFilters = reactive({
  searchTerm: '',
  category: '',
  priceRange: { min: null, max: null },
  biddingStatus: 'all',
  sortBy: 'newest',
})

const showFilters = ref(false)

// Categories list (could be fetched from API)
const categories = ref([
  'Elektronika',
  'Namještaj',
  'Odjeća',
  'Knjige',
  'Sport',
  'Igračke',
  'Antikviteti',
  'Satovi',
  'Računala',
  'Glazbala',
  'Ostalo',
])

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    localFilters.category ||
    localFilters.priceRange.min ||
    localFilters.priceRange.max ||
    localFilters.biddingStatus !== 'all' ||
    localFilters.sortBy !== 'newest'
  )
})

const formatPriceRange = computed(() => {
  const min = localFilters.priceRange.min
  const max = localFilters.priceRange.max
  if (min && max) return `€${min} - €${max}`
  if (min) return `Od €${min}`
  if (max) return `Do €${max}`
  return ''
})

const biddingStatusLabel = computed(() => {
  const labels = {
    bidding: 'Licitacije',
    regular: 'Obični proizvodi',
    active: 'Aktivne licitacije',
    ended: 'Završene licitacije',
  }
  return labels[localFilters.biddingStatus] || ''
})

const sortByLabel = computed(() => {
  const labels = {
    oldest: 'Najstarije',
    'price-low': 'Cijena ↑',
    'price-high': 'Cijena ↓',
    'name-asc': 'Naziv A-Z',
    'name-desc': 'Naziv Z-A',
    'most-bids': 'Najviše ponuda',
    'ending-soon': 'Završava uskoro',
  }
  return labels[localFilters.sortBy] || ''
})

// Methods
const applyFilters = () => {
  emit('update:filters', { ...localFilters })
  emit('search', { ...localFilters })
}

const clearSearch = () => {
  localFilters.searchTerm = ''
  applyFilters()
}

const clearFilter = (filterType) => {
  switch (filterType) {
    case 'category':
      localFilters.category = ''
      break
    case 'price':
      localFilters.priceRange.min = null
      localFilters.priceRange.max = null
      break
    case 'bidding':
      localFilters.biddingStatus = 'all'
      break
    case 'sort':
      localFilters.sortBy = 'newest'
      break
  }
  applyFilters()
}

const clearAllFilters = () => {
  localFilters.category = ''
  localFilters.priceRange.min = null
  localFilters.priceRange.max = null
  localFilters.biddingStatus = 'all'
  localFilters.sortBy = 'newest'
  applyFilters()
}

const resetFilters = () => {
  clearAllFilters()
  localFilters.searchTerm = ''
}

// Load categories from API
const loadCategories = async () => {
  try {
    // Could fetch from API endpoint
    // const response = await api.get('/products/util/categories')
    // categories.value = response.data.categories
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

// Initialize filters from props
watch(
  () => props.filters,
  (newFilters) => {
    Object.assign(localFilters, newFilters)
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.search-filters {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

/* Search Section */
.search-section {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.search-bar {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.clear-search-btn:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: #0056b3;
}

/* Filter Toggles */
.filter-toggles {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-toggle-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.filter-toggle-btn:hover,
.filter-toggle-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.active-filters-label {
  color: #6c757d;
  font-size: 0.875rem;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-filter {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  padding: 0;
  font-size: 0.75rem;
}

.remove-filter:hover {
  color: #dc3545;
}

.clear-all-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-all-btn:hover {
  background: #c82333;
}

/* Filter Panel */
.filter-panel {
  padding: 1.5rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0; /* Prevent overflow */
}

.filter-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.price-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: 0; /* Prevent overflow */
  width: 100%;
}

.price-input:focus {
  outline: none;
  border-color: #007bff;
}

.price-separator {
  color: #6c757d;
  font-weight: 500;
}

/* Filter Actions */
.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.apply-filters-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.apply-filters-btn:hover {
  background: #218838;
}

.reset-filters-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.reset-filters-btn:hover {
  background: #5a6268;
}

/* Results Summary */
.results-summary {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.results-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

.search-term {
  color: #007bff;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-toggles {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .price-range {
    gap: 1rem;
  }

  .filter-actions {
    flex-direction: column;
  }

  .apply-filters-btn,
  .reset-filters-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  .search-filters {
    background: #1f2937 !important;
    border-color: #374151 !important;
  }

  .search-section {
    background: #1f2937 !important;
  }

  .search-input {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .search-input:hover {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .search-input:focus {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #3b82f6 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .search-input::placeholder {
    color: #9ca3af !important;
  }

  .search-icon {
    color: #9ca3af !important;
  }

  .filter-toggle-btn {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
  }

  .filter-toggle-btn:hover,
  .filter-toggle-btn.active {
    background: #3b82f6 !important;
    color: white !important;
    border-color: #3b82f6 !important;
  }

  .filter-section h4,
  .filter-section label {
    color: #f9fafb !important;
  }

  .filter-grid {
    background: #1f2937 !important;
  }

  .filter-section {
    background: #374151 !important;
    border-color: #4b5563 !important;
  }

  .category-options button,
  .sort-options button {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
  }

  .category-options button:hover,
  .sort-options button:hover {
    background: #374151 !important;
    color: #f9fafb !important;
  }

  .category-options button.active,
  .sort-options button.active {
    background: #3b82f6 !important;
    color: white !important;
  }

  .price-input {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .price-input:focus {
    border-color: #3b82f6 !important;
  }

  .filter-tag {
    background: #374151 !important;
    color: #f9fafb !important;
  }

  .active-filters-label {
    color: #f9fafb !important;
  }
}
</style>
