<template>
  <div class="products-section">
    <div class="section-header">
      <h3>Svi proizvodi</h3>
      <span class="product-count">{{ products.length }} proizvoda</span>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <span>Učitavanje proizvoda...</span>
    </div>

    <div v-else-if="products.length > 0" class="products-grid">
      <AdminProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
        @edit-product="$emit('edit-product', $event)"
        @delete-product="$emit('delete-product', $event)"
      />
    </div>

    <div v-else class="no-products">
      <i class="pi pi-box no-products-icon"></i>
      <h3>Nema proizvoda</h3>
      <p>Trenutno nema proizvoda u sustavu.</p>
    </div>
  </div>
</template>

<script setup>
import AdminProductCard from './AdminProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit-product', 'delete-product'])
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.product-count {
  background: #e3f2fd;
  color: #2a5298;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 15px;
}

.loading-icon {
  font-size: 2rem;
  color: #2a5298;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.no-products {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-products-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
