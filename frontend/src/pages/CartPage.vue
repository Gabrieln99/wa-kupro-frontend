<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="cart-container">
        <h2>Vaša košarica</h2>

        <!-- Empty Cart State -->
        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <i class="pi pi-shopping-cart"></i>
          <h3>Košarica je prazna</h3>
          <p>Dodajte proizvode u košaricu da biste počeli s kupovinom</p>
          <button class="shop-button" @click="$router.push('/products')">
            <i class="pi pi-shopping-bag"></i>
            Idite na kupovinu
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>

              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-category">{{ item.category }}</p>
                <div class="item-status">
                  <i
                    class="pi"
                    :class="{
                      'pi-clock': item.isBidding,
                      'pi-check-circle': !item.isBidding,
                    }"
                  ></i>
                  <span>{{ item.isBidding ? 'Licitacija završena' : 'Direktna kupnja' }}</span>
                </div>
              </div>

              <div class="quantity-controls">
                <button
                  class="quantity-btn"
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                >
                  <i class="pi pi-minus"></i>
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button
                  class="quantity-btn"
                  @click="increaseQuantity(item)"
                  :disabled="item.quantity >= item.maxStock"
                >
                  <i class="pi pi-plus"></i>
                </button>
              </div>

              <div class="item-price">
                <span class="unit-price">{{ item.price }}€ / kom</span>
                <span class="total-price">{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>

              <button class="remove-btn" @click="removeItem(item.id)">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="cart-summary">
            <div class="summary-card">
              <h3>Sažetak narudžbe</h3>

              <div class="summary-line">
                <span>Ukupno proizvoda:</span>
                <span>{{ cartStore.itemCount }}</span>
              </div>

              <div class="summary-line">
                <span>Ukupan iznos:</span>
                <span class="total-amount">{{ cartStore.totalPrice.toFixed(2) }}€</span>
              </div>

              <div class="payment-methods">
                <h4>Način plaćanja:</h4>
                <div class="payment-options">
                  <label class="payment-option">
                    <input type="radio" v-model="paymentMethod" value="card" />
                    <span>💳 Kartica</span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" v-model="paymentMethod" value="cash" />
                    <span>💵 Gotovina pri preuzimanju</span>
                  </label>
                </div>
              </div>

              <button
                class="purchase-btn"
                @click="processPurchase"
                :disabled="cartStore.isLoading || cartStore.items.length === 0"
              >
                <i class="pi" :class="cartStore.isLoading ? 'pi-spin pi-spinner' : 'pi-check'"></i>
                {{ cartStore.isLoading ? 'Obrađuje se...' : 'Završi kupnju' }}
              </button>

              <button class="clear-cart-btn" @click="clearCart">
                <i class="pi pi-trash"></i>
                Isprazni košaricu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const cartStore = useCartStore()
const paymentMethod = ref('card')

const increaseQuantity = (item) => {
  try {
    cartStore.updateQuantity(item.id, item.quantity + 1)
  } catch (error) {
    console.error('Error increasing quantity:', error)
  }
}

const decreaseQuantity = (item) => {
  try {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  } catch (error) {
    console.error('Error decreasing quantity:', error)
  }
}

const removeItem = (itemId) => {
  cartStore.removeFromCart(itemId)
}

const clearCart = () => {
  if (confirm('Jeste li sigurni da želite isprazniti košaricu?')) {
    cartStore.clearCart()
  }
}

const processPurchase = async () => {
  try {
    const result = await cartStore.purchaseCart(paymentMethod.value)

    // Show success message and redirect
    alert(`Kupnja je uspješno završena!\nBroj narudžbe: ${result.orderId}`)
    router.push('/products')
  } catch (error) {
    alert(error.message || 'Greška pri obradi kupnje')
  }
}
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  background: #f8f9fa;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-container h2 {
  text-align: center;
  color: #2a5298;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 700;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.item-category {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.item-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #059669;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #e9ecef;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #2a5298;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-price {
  text-align: right;
}

.unit-price {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.total-price {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2a5298;
}

.remove-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

/* Cart Summary */
.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.total-amount {
  font-weight: 700;
  color: #2a5298;
  font-size: 1.3rem;
}

.payment-methods {
  margin: 2rem 0;
}

.payment-methods h4 {
  margin: 0 0 1rem 0;
  color: #333;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  background: #e9ecef;
}

.payment-option input[type='radio'] {
  margin: 0;
}

.purchase-btn {
  width: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.purchase-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(42, 82, 152, 0.3);
}

.purchase-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.clear-cart-btn {
  width: 100%;
  background: transparent;
  color: #dc2626;
  border: 2px solid #dc2626;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.clear-cart-btn:hover {
  background: #dc2626;
  color: white;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.empty-cart-icon {
  font-size: 4rem;
  color: #e5e7eb;
  margin-bottom: 1rem;
}

.empty-cart h3 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-cart p {
  color: #999;
  margin-bottom: 2rem;
}

.shopping-btn {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(42, 82, 152, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cart-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 1rem;
  }

  .cart-container h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .item-details {
    text-align: left;
  }

  .quantity-controls {
    justify-self: center;
  }

  .summary-card {
    padding: 1.5rem;
  }
}

.empty-cart {
  background: white;
  border-radius: 15px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-cart i {
  font-size: 4rem;
  color: #2a5298;
  margin-bottom: 20px;
}

.empty-cart h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.shop-button {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.shop-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(42, 82, 152, 0.3);
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 10px;
  }

  .cart-container h2 {
    font-size: 2rem;
  }

  .empty-cart {
    padding: 40px 20px;
  }

  .empty-cart i {
    font-size: 3rem;
  }

  .empty-cart h3 {
    font-size: 1.5rem;
  }
}
</style>
