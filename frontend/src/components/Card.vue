<template>
  <div class="product-card">
    <img :src="image" :alt="title" class="product-image" />
    <div class="product-info">
      <h3 class="product-title">{{ title }}</h3>
      <p class="product-description">{{ description }}</p>
      <div class="product-bottom">
        <span class="product-price">{{ price }} €</span>
        <div class="product-actions">
          <Button
            label="Add to Cart"
            icon="pi pi-shopping-cart"
            class="p-button-sm blue-btn"
            @click="$emit('add-to-cart')"
          />
          <div v-if="biddingEnabled" class="bid-section">
            <input
              v-model="bidValue"
              type="number"
              min="0"
              class="bid-input"
              placeholder="Your bid"
            />
            <Button
              label="Bid"
              icon="pi pi-money-bill"
              class="p-button-sm blue-btn"
              @click="emitBid"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  title: String,
  description: String,
  price: [String, Number],
  image: String,
  biddingEnabled: Boolean,
})

const bidValue = ref('')

function emitBid() {
  if (bidValue.value && Number(bidValue.value) > 0) {
    emit('bid', bidValue.value)
    bidValue.value = ''
  }
}

const emit = defineEmits(['add-to-cart', 'bid'])
</script>

<style scoped>
.product-card {
  background: #fff;
  border: 1px solid #e3f2fd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 270px;
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.16);
}
.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #e3f2fd;
}
.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.product-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 0.5rem;
}
.product-description {
  font-size: 0.97rem;
  color: #555;
  margin-bottom: 1rem;
  flex: 1;
}
.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}
.bid-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.2rem;
}
.bid-input {
  width: 80px;
  padding: 0.3rem 0.5rem;
  border: 1px solid #1976d2;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #1976d2;
  outline: none;
  transition: border 0.2s;
}
.bid-input:focus {
  border: 1.5px solid #1976d2;
}
.product-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1976d2;
}
.blue-btn {
  color: #1976d2 !important;
  border: 1px solid #1976d2 !important;
  background: #fff !important;
  transition:
    background 0.2s,
    color 0.2s;
}
.blue-btn:hover,
.blue-btn:focus {
  background: #1976d2 !important;
  color: #fff !important;
  border: 1px solid #1976d2 !important;
}
</style>
