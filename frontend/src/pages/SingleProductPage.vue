<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <span>Učitavanje proizvoda...</span>
      </div>

      <!-- Product not found -->
      <div v-else-if="!product" class="not-found">
        <i class="pi pi-exclamation-triangle"></i>
        <h2>Proizvod nije pronađen</h2>
        <Button
          label="Povratak na proizvode"
          icon="pi pi-arrow-left"
          @click="router.push('/products')"
        />
      </div>

      <!-- Product details -->
      <div v-else class="product-container">
        <!-- Breadcrumb -->
        <Breadcrumb :current-product="product" />

        <div class="product-details">
          <!-- Product Image -->
          <div class="product-image-section">
            <div class="main-image-container">
              <img :src="product.image" :alt="product.name" class="main-image" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info-section">
            <div class="product-header">
              <span class="product-category">{{ product.category }}</span>
              <h1 class="product-title">{{ product.name }}</h1>

              <!-- Stock status -->
              <div class="stock-status" :class="stockStatusClass">
                <i :class="stockIcon"></i>
                <span>{{ stockText }}</span>
              </div>
            </div>

            <!-- Price section -->
            <div class="price-container">
              <div class="current-price">{{ product.currentPrice }} €</div>
              <div
                v-if="product.originalPrice && product.originalPrice !== product.currentPrice"
                class="original-price"
              >
                {{ product.originalPrice }} €
              </div>

              <!-- Bidding info -->
              <div v-if="product.isBidding" class="bidding-info">
                <span class="bidding-label">Trenutno najveća ponuda</span>
                <div class="best-bidder" v-if="product.bestBidder">
                  Korisnik: {{ product.bestBidder }}
                </div>
              </div>
            </div>

            <!-- Product details -->
            <div class="product-specifications">
              <h3>Specifikacije</h3>
              <div class="spec-grid">
                <div class="spec-item">
                  <span class="spec-label">Boja:</span>
                  <span class="spec-value">{{ product.color }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Stanje:</span>
                  <span class="spec-value">{{
                    product.stock > 0 ? 'Dostupno' : 'Nedostupno'
                  }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Količina:</span>
                  <span class="spec-value">{{ product.stock }} kom</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="product-description">
              <h3>Opis</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- Actions -->
            <div class="product-actions">
              <!-- Direct sale -->
              <div v-if="!product.isBidding" class="direct-sale-actions">
                <Button
                  :label="isAuthenticated ? 'Dodaj u košaricu' : 'Prijavite se za kupnju'"
                  :icon="isAuthenticated ? 'pi pi-shopping-cart' : 'pi pi-sign-in'"
                  class="primary-btn"
                  :class="{ 'disabled-btn': !isAuthenticated || product.stock === 0 }"
                  :disabled="!isAuthenticated || product.stock === 0"
                  @click="handleAddToCart"
                />
              </div>

              <!-- Bidding -->
              <div v-else class="bidding-actions">
                <div class="bid-input-section">
                  <label class="bid-label">Vaša ponuda:</label>
                  <div class="bid-input-wrapper">
                    <input
                      v-model="bidAmount"
                      type="number"
                      :min="product.currentPrice + 1"
                      class="bid-input"
                      :class="{ 'disabled-input': !isAuthenticated }"
                      :placeholder="
                        isAuthenticated
                          ? `Minimalno ${product.currentPrice + 1}€`
                          : 'Prijavite se za ponude'
                      "
                      :disabled="!isAuthenticated"
                    />
                    <span class="currency">€</span>
                  </div>
                </div>
                <Button
                  :label="isAuthenticated ? 'Postavi ponudu' : 'Prijavite se'"
                  :icon="isAuthenticated ? 'pi pi-money-bill' : 'pi pi-sign-in'"
                  class="primary-btn bid-btn"
                  :class="{ 'disabled-btn': !isAuthenticated }"
                  :disabled="!isAuthenticated || !bidAmount || bidAmount <= product.currentPrice"
                  @click="handlePlaceBid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification -->
      <div v-if="notification" class="notification" :class="notification.type">
        <i :class="notification.icon"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Button from 'primevue/button'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Breadcrumb from '../components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const product = ref(null)
const loading = ref(true)
const bidAmount = ref('')
const notification = ref(null)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

const stockStatusClass = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 0 ? 'in-stock' : 'out-of-stock'
})

const stockIcon = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'
})

const stockText = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 0 ? `Na stanju (${product.value.stock} kom)` : 'Nedostupno'
})

// Methods
const loadProduct = async () => {
  try {
    loading.value = true
    const productId = route.params.id

    // Simulate API call - replace with actual API call
    const response = await fetch(`http://localhost:3000/api/products/${productId}`)
    if (response.ok) {
      product.value = await response.json()
    } else {
      product.value = null
    }
  } catch (error) {
    console.error('Error loading product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  if (product.value.stock === 0) {
    showNotification('Proizvod nije dostupan!', 'error')
    return
  }

  try {
    // Add to cart logic - replace with actual API call
    showNotification('Proizvod je dodan u košaricu!', 'success')
  } catch (error) {
    console.error('Error adding to cart:', error)
    showNotification('Greška pri dodavanju u košaricu!', 'error')
  }
}

const handlePlaceBid = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  const bid = Number(bidAmount.value)
  if (bid <= product.value.currentPrice) {
    showNotification('Ponuda mora biti veća od trenutne cijene!', 'error')
    return
  }

  try {
    // Place bid logic - replace with actual API call
    const response = await fetch(`http://localhost:3000/api/products/${product.value._id}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ bidAmount: bid }),
    })

    if (response.ok) {
      const updatedProduct = await response.json()
      product.value.currentPrice = updatedProduct.currentPrice
      product.value.bestBidder = authStore.user.username
      bidAmount.value = ''
      showNotification('Ponuda je uspješno postavljena!', 'success')
    } else {
      throw new Error('Failed to place bid')
    }
  } catch (error) {
    console.error('Error placing bid:', error)
    showNotification('Greška pri postavljanju ponude!', 'error')
  }
}

const showNotification = (message, type) => {
  notification.value = {
    message,
    type,
    icon: type === 'success' ? 'pi pi-check' : 'pi pi-times',
  }

  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.page-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: white;
  gap: 15px;
}

.loading-icon {
  font-size: 3rem;
  color: #fff;
}

/* Not found */
.not-found {
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.not-found i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #ffd700;
}

.not-found h2 {
  margin-bottom: 30px;
  font-size: 2rem;
}

/* Product Container */
.product-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

/* Image Section */
.product-image-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main-image-container {
  width: 100%;
  max-width: 500px;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Product Info */
.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.product-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.product-category {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 15px 0;
  line-height: 1.2;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
}

.stock-status.in-stock {
  color: #28a745;
}

.stock-status.out-of-stock {
  color: #dc3545;
}

/* Price Section */
.price-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #2a5298;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2a5298;
  margin-bottom: 5px;
}

.original-price {
  font-size: 1.2rem;
  color: #666;
  text-decoration: line-through;
}

.bidding-info {
  margin-top: 15px;
}

.bidding-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.best-bidder {
  font-size: 16px;
  color: #2a5298;
  font-weight: 600;
  margin-top: 5px;
}

/* Specifications */
.product-specifications h3,
.product-description h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.spec-grid {
  display: grid;
  gap: 10px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.spec-label {
  font-weight: 600;
  color: #666;
}

.spec-value {
  color: #333;
}

/* Description */
.product-description p {
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

/* Actions */
.product-actions {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  margin-top: 20px;
}

.direct-sale-actions {
  display: flex;
  justify-content: center;
}

.bidding-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bid-input-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bid-label {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.bid-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.bid-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.bid-input:focus {
  outline: none;
  border-color: #2a5298;
}

.bid-input.disabled-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.currency {
  position: absolute;
  right: 15px;
  font-weight: 600;
  color: #666;
}

.primary-btn {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border: none;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(42, 82, 152, 0.3);
}

.primary-btn.disabled-btn {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.bid-btn {
  margin-top: 10px;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  border-left: 4px solid #28a745;
  color: #28a745;
}

.notification.error {
  border-left: 4px solid #dc3545;
  color: #dc3545;
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

/* Responsive */
@media (max-width: 768px) {
  .product-details {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .main-content {
    padding: 20px 10px;
  }

  .product-title {
    font-size: 1.8rem;
  }

  .current-price {
    font-size: 2rem;
  }
}
</style>
