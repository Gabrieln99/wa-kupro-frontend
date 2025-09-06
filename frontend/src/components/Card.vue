<template>
  <div class="product-card">
    <div class="image-container">
      <img :src="image" :alt="name" class="product-image" />
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ name }}</h3>

      <div class="price-section">
        <span class="current-price">{{ currentPrice }} €</span>
      </div>

      <div class="product-actions">
        <!-- Direct sale button -->
        <Button
          v-if="!isBidding"
          :label="isAuthenticated ? 'Dodaj u košaricu' : 'Prijavite se za kupnju'"
          :icon="isAuthenticated ? 'pi pi-shopping-cart' : 'pi pi-sign-in'"
          class="action-btn cart-btn"
          :class="{ 'disabled-btn': !isAuthenticated }"
          @click="$emit('add-to-cart')"
        />

        <!-- Bidding section -->
        <div v-else class="bid-section">
          <div class="bid-input-wrapper">
            <input
              v-model="bidValue"
              type="number"
              :min="currentPrice + 1"
              class="bid-input"
              :class="{ 'disabled-input': !isAuthenticated }"
              :placeholder="
                isAuthenticated ? `Min. ${currentPrice + 1}€` : 'Prijavite se za ponude'
              "
              :disabled="!isAuthenticated"
            />
          </div>
          <Button
            :label="isAuthenticated ? 'Ponudi' : 'Prijavite se'"
            :icon="isAuthenticated ? 'pi pi-money-bill' : 'pi pi-sign-in'"
            class="action-btn bid-btn"
            :class="{ 'disabled-btn': !isAuthenticated }"
            :disabled="!isAuthenticated || !bidValue || bidValue <= currentPrice"
            @click="emitBid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const authStore = useAuthStore()

const props = defineProps({
  name: String,
  image: String,
  currentPrice: Number,
  isBidding: Boolean,
})

const bidValue = ref('')

// Computed property for authentication status
const isAuthenticated = authStore.isAuthenticated

function emitBid() {
  if (bidValue.value && Number(bidValue.value) > props.currentPrice) {
    emit('place-bid', Number(bidValue.value))
    bidValue.value = ''
  }
}

const emit = defineEmits(['add-to-cart', 'place-bid'])
</script>

<style scoped>
.product-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 260px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #3b82f6;
}

.image-container {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  position: relative;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  text-align: center;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-actions {
  margin-top: auto;
}

.action-btn {
  width: 100%;
  padding: 1rem !important;
  border-radius: 0.75rem !important;
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  position: relative;
  overflow: hidden;
}

.cart-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.cart-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.5);
}

.cart-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cart-btn:hover::before {
  left: 100%;
}

.bid-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bid-input-wrapper {
  position: relative;
}

.bid-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #1e293b;
  outline: none;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-weight: 600;
  text-align: center;
}

.bid-input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.bid-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.bid-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
  position: relative;
  overflow: hidden;
}

.bid-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.5);
}

.bid-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.bid-btn:hover::before {
  left: 100%;
}

.bid-btn:disabled {
  background: #9ca3af !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.bid-btn:disabled::before {
  display: none;
}

/* Disabled states for non-authenticated users */
.disabled-btn {
  background: #6b7280 !important;
  color: #d1d5db !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.disabled-btn:hover {
  background: #6b7280 !important;
  transform: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.disabled-btn::before {
  display: none !important;
}

.disabled-input {
  background: #f3f4f6 !important;
  color: #9ca3af !important;
  cursor: not-allowed !important;
  border-color: #d1d5db !important;
}

.disabled-input:focus {
  border-color: #d1d5db !important;
  background: #f3f4f6 !important;
  box-shadow: none !important;
  transform: none !important;
}

.disabled-input::placeholder {
  color: #9ca3af !important;
  font-style: italic;
}

/* Add subtle animation to the entire card */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Responsive design */
@media (max-width: 768px) {
  .product-card {
    width: 100%;
    max-width: 240px;
  }

  .product-info {
    padding: 1.25rem;
  }

  .action-btn {
    padding: 0.875rem !important;
  }
}

/* Add a subtle glow effect */
.product-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(29, 78, 216, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 1rem;
}

.product-card:hover::after {
  opacity: 1;
}
</style>
