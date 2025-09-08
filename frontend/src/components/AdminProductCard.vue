<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h4>{{ product.name }}</h4>
      <p class="category">{{ product.category }}</p>
      <p class="price">{{ product.currentPrice }} €</p>
      <p class="stock">Skladište: {{ product.stock }} kom</p>
      <span class="sale-type" :class="product.isBidding ? 'bidding' : 'direct'">
        {{ product.isBidding ? 'Licitacija' : 'Direktna prodaja' }}
      </span>
    </div>
    <div class="product-actions">
      <Button
        icon="pi pi-pencil"
        class="p-button-sm p-button-outlined"
        title="Uredi"
        @click="$emit('edit-product', product._id)"
      />
      <Button
        icon="pi pi-trash"
        class="p-button-sm p-button-outlined p-button-danger"
        title="Obriši"
        @click="$emit('delete-product', product._id)"
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit-product', 'delete-product'])
</script>

<style scoped>
.product-card {
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
}

.product-info .category {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.product-info .price {
  color: #2a5298;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 0 5px 0;
}

.product-info .stock {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
}

.sale-type {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sale-type.direct {
  background: #e8f5e8;
  color: #2e7d2e;
}

.sale-type.bidding {
  background: #fff3cd;
  color: #856404;
}

.product-actions {
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
}
</style>
