<template>
  <div class="product-card">
    <div class="image-container" @click="$emit('view-product')">
      <img :src="image" :alt="name" class="product-image" />
      <div class="image-overlay">
        <i class="pi pi-eye view-icon"></i>
        <span class="view-text">Pogledaj detalje</span>
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name" @click="$emit('view-product')">{{ name }}</h3>

      <div class="price-section">
        <span class="current-price">{{ currentPrice }} €</span>
        <span v-if="originalPrice && originalPrice !== currentPrice" class="original-price">
          {{ originalPrice }} €
        </span>
      </div>

      <!-- Product Status -->
      <div class="product-status" :class="statusClass">
        <i
          class="pi"
          :class="{
            'pi-check-circle': statusClass === 'status-available',
            'pi-clock': statusClass === 'status-bidding',
            'pi-times-circle': statusClass === 'status-unavailable',
            'pi-lock': statusClass === 'status-reserved',
          }"
        ></i>
        <span>{{ productStatusText }}</span>
      </div>

      <!-- Bidding Info (if applicable) -->
      <div v-if="isBidding && biddingStatus === 'active'" class="bidding-info">
        <div v-if="timeRemaining" class="time-remaining">
          <i class="pi pi-clock"></i>
          <span>{{ timeRemaining }}</span>
        </div>
        <div v-if="bidCount > 0" class="bid-count">
          <i class="pi pi-users"></i>
          <span>{{ bidCount }} ponuda</span>
        </div>
      </div>

      <div class="product-actions">
        <!-- Direct sale button -->
        <Button
          v-if="!isBidding || (isBidding && biddingStatus !== 'active')"
          :label="getCartButtonLabel"
          :icon="getCartButtonIcon"
          class="action-btn cart-btn"
          :class="{ 'disabled-btn': !canAddToCart }"
          :disabled="!canAddToCart"
          @click="$emit('add-to-cart')"
        />

        <!-- Bidding section -->
        <div v-if="isBidding && biddingStatus === 'active'" class="bid-section">
          <div class="bid-input-wrapper">
            <input
              v-model="bidValue"
              type="number"
              :min="currentPrice + 1"
              class="bid-input"
              :class="{ 'disabled-input': !canBid }"
              :placeholder="canBid ? `Min. ${currentPrice + 1}€` : 'Prijavite se za ponude'"
              :disabled="!canBid"
            />
          </div>
          <Button
            :label="canBid ? 'Ponudi' : 'Prijavite se'"
            :icon="canBid ? 'pi pi-money-bill' : 'pi pi-sign-in'"
            class="action-btn bid-btn"
            :class="{ 'disabled-btn': !canBid }"
            :disabled="!canBid || !bidValue || bidValue <= currentPrice"
            @click="emitBid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const authStore = useAuthStore()

const props = defineProps({
  name: String,
  image: String,
  currentPrice: Number,
  originalPrice: Number,
  isBidding: Boolean,
  biddingStatus: String,
  timeRemaining: String,
  bidCount: Number,
  bestBidder: String,
  category: String,
  stock: {
    type: Number,
    default: 1,
  },
})

const bidValue = ref('')

// Computed properties
const isAuthenticated = authStore.isAuthenticated

const isProductAvailable = computed(() => {
  // Check if product is sold out
  if (props.stock <= 0) return false

  // Check if product is sold
  if (props.biddingStatus === 'sold') return false

  // If it's a bidding product and still active, can't purchase directly
  if (props.isBidding && props.biddingStatus === 'active') return 'bidding-only'

  // If reserved for someone else (we don't know if current user is winner)
  if (props.biddingStatus === 'reserved') return 'reserved'

  return true
})

const canAddToCart = computed(() => {
  // Debug logging
  console.log('🛒 Cart access check:', {
    name: props.name,
    isProductAvailable: isProductAvailable.value,
    isAuthenticated: isAuthenticated,
    userRole: authStore.role,
  })

  return isProductAvailable.value === true && isAuthenticated
})

const canBid = computed(() => {
  // Debug logging
  console.log('🎯 Card bid check:', {
    name: props.name,
    isBidding: props.isBidding,
    biddingStatus: props.biddingStatus,
    isAuthenticated: isAuthenticated,
  })

  return props.isBidding && props.biddingStatus === 'active' && isAuthenticated
})

const productStatusText = computed(() => {
  if (props.stock <= 0) return 'Rasprodano'
  if (props.biddingStatus === 'sold') return 'Prodano'
  if (props.biddingStatus === 'reserved') return 'Rezervirano'
  if (props.isBidding && props.biddingStatus === 'active') return 'Na licitaciji'
  if (props.isBidding && props.biddingStatus === 'ended') return 'Licitacija završena'
  return 'Dostupno'
})

const statusClass = computed(() => {
  if (props.stock <= 0 || props.biddingStatus === 'sold') return 'status-unavailable'
  if (props.biddingStatus === 'reserved') return 'status-reserved'
  if (props.isBidding && props.biddingStatus === 'active') return 'status-bidding'
  return 'status-available'
})

const getCartButtonLabel = computed(() => {
  if (!isAuthenticated) return 'Prijavite se za kupnju'
  if (props.stock <= 0) return 'Rasprodano'
  if (props.biddingStatus === 'sold') return 'Prodano'
  if (props.biddingStatus === 'reserved') return 'Rezervirano'
  return 'Dodaj u košaricu'
})

const getCartButtonIcon = computed(() => {
  if (!isAuthenticated) return 'pi pi-sign-in'
  if (props.stock <= 0 || props.biddingStatus === 'sold') return 'pi pi-times'
  if (props.biddingStatus === 'reserved') return 'pi pi-lock'
  return 'pi pi-shopping-cart'
})

function emitBid() {
  if (bidValue.value && Number(bidValue.value) > props.currentPrice) {
    emit('place-bid', Number(bidValue.value))
    bidValue.value = ''
  }
}

const emit = defineEmits(['add-to-cart', 'place-bid', 'view-product'])
</script>

<style scoped>
.product-card {
  background: var(--app-card-bg, #fff);
  border: 1px solid var(--app-border-color, #e2e8f0);
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px var(--app-shadow, rgba(0, 0, 0, 0.1)),
    0 2px 4px -1px var(--app-shadow, rgba(0, 0, 0, 0.06));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 260px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  color: var(--app-text-color, #1f2937);
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
  cursor: pointer;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  gap: 0.5rem;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.view-icon {
  font-size: 2rem;
}

.view-text {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
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
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-name:hover {
  color: #3b82f6;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--app-primary-color, #2563eb);
  display: block;
}

.original-price {
  font-size: 0.9rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

/* Product Status Styles */
.product-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-available {
  background: #ecfdf5;
  color: #059669;
}

.status-bidding {
  background: #fef3c7;
  color: #d97706;
}

.status-unavailable {
  background: #fef2f2;
  color: #dc2626;
}

.status-reserved {
  background: #f3f4f6;
  color: #6b7280;
}

/* Bidding Info Styles */
.bidding-info {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.time-remaining,
.bid-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.time-remaining i,
.bid-count i {
  font-size: 0.75rem;
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
