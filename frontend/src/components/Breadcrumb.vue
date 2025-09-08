<template>
  <nav class="breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <router-link to="/" class="breadcrumb-link">
          <i class="pi pi-home"></i>
          Početna
        </router-link>
      </li>
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
        <span class="breadcrumb-separator">/</span>
        <router-link
          v-if="item.to && index < breadcrumbItems.length - 1"
          :to="item.to"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb-current">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  category: {
    type: String,
    default: '',
  },
  searchTerm: {
    type: String,
    default: '',
  },
  currentProduct: {
    type: Object,
    default: null,
  },
})

const route = useRoute()

const breadcrumbItems = computed(() => {
  const items = [...props.items]

  // Add Products link when on single product page
  if (props.currentProduct) {
    items.push({
      label: 'Proizvodi',
      to: { name: 'Products' },
    })
  }

  // Add category if present (either from props or current product)
  const category = props.category || props.currentProduct?.category
  if (category) {
    items.push({
      label: category,
      to: { name: 'Products', query: { category: category } },
    })
  }

  // Add current product if present
  if (props.currentProduct) {
    items.push({
      label: props.currentProduct.name,
      to: null,
    })
  }

  // Add search term if present
  if (props.searchTerm) {
    items.push({
      label: `Pretraživanje: "${props.searchTerm}"`,
      to: null,
    })
  }

  return items
})
</script>

<style scoped>
.breadcrumb {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.breadcrumb-link i {
  margin-right: 0.25rem;
  font-size: 0.875rem;
}

.breadcrumb-current {
  color: #6c757d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .breadcrumb-list {
    padding: 0 0.5rem;
    font-size: 0.875rem;
  }

  .breadcrumb-separator {
    margin: 0 0.25rem;
  }
}
</style>
