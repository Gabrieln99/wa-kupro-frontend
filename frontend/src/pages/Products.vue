<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <h2>Proizvodi</h2>

      <!-- Notification for successful actions -->
      <div v-if="notification" class="notification" :class="notification.type">
        <i :class="notification.icon"></i>
        <span>{{ notification.message }}</span>
      </div>

      <div class="products-grid">
        <Card
          v-for="product in products"
          :key="product.id"
          :name="product.name"
          :current-price="product.currentPrice"
          :image="product.image"
          :is-bidding="product.isBidding"
          @add-to-cart="handleAddToCart(product)"
          @place-bid="handlePlaceBid(product, $event)"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Card from '@/components/Card.vue'

// Auth store
const authStore = useAuthStore()
const router = useRouter()

// Reactive products data
const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    currentPrice: 999,
    originalPrice: 999,
    image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=iPhone+15',
    isBidding: false,
    category: 'Elektronika',
    stock: 5,
    color: 'Titanium',
    description: 'Najnoviji iPhone s titanijskim kućištem',
  },
  {
    id: 2,
    name: 'Vintage Rolex',
    currentPrice: 2500,
    originalPrice: 2500,
    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Rolex',
    isBidding: true,
    category: 'Satovi',
    stock: 1,
    color: 'Zlatni',
    description: 'Rijetki vintage Rolex iz 1960-ih',
    bestBid: 2500,
    bestBidder: 'user123',
  },
  {
    id: 3,
    name: 'MacBook Pro',
    currentPrice: 1899,
    originalPrice: 1899,
    image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=MacBook',
    isBidding: false,
    category: 'Računala',
    stock: 3,
    color: 'Space Grey',
    description: 'MacBook Pro 14-inch s M3 čipom',
  },
  {
    id: 4,
    name: 'Antique Vase',
    currentPrice: 150,
    originalPrice: 150,
    image: 'https://via.placeholder.com/300x200/fbbf24/ffffff?text=Antique+Vase',
    isBidding: true,
    category: 'Antikviteti',
    stock: 1,
    color: 'Plavi',
    description: 'Stara kineska vaza iz Ming dinastije',
    bestBid: 150,
    bestBidder: 'collector1',
  },
  {
    id: 5,
    name: 'Gaming Chair',
    currentPrice: 299,
    originalPrice: 299,
    image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Gaming+Chair',
    isBidding: false,
    category: 'Namještaj',
    stock: 8,
    color: 'Crni',
    description: 'Ergonomska gaming stolica s LED osvjetljenjem',
  },
])

// Cart state
const cart = ref([])

// Notification system
const notification = ref(null)

function showNotification(message, type = 'success', icon = 'pi pi-check') {
  notification.value = { message, type, icon }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

function handleAddToCart(product) {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    showNotification(
      'Morate se prijaviti da biste dodali proizvode u košaricu!',
      'error',
      'pi pi-exclamation-triangle',
    )
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login')
    }, 1000)
    return
  }

  // Check if product is already in cart
  const existingItem = cart.value.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
    showNotification(
      `Dodana još jedna ${product.name} u košaricu!`,
      'success',
      'pi pi-shopping-cart',
    )
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.currentPrice,
      image: product.image,
      quantity: 1,
    })
    showNotification(`${product.name} je dodana u košaricu!`, 'success', 'pi pi-shopping-cart')
  }

  console.log('Current cart:', cart.value)
}

function handlePlaceBid(product, bidAmount) {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    showNotification(
      'Morate se prijaviti da biste mogli postavljati ponude!',
      'error',
      'pi pi-exclamation-triangle',
    )
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login')
    }, 1000)
    return
  }

  // Validate bid
  if (bidAmount <= product.currentPrice) {
    showNotification(
      `Ponuda mora biti veća od ${product.currentPrice}€!`,
      'error',
      'pi pi-exclamation-triangle',
    )
    return
  }

  // Find and update the product
  const productIndex = products.value.findIndex((p) => p.id === product.id)
  if (productIndex !== -1) {
    // Update the current price (highest bid)
    products.value[productIndex].currentPrice = bidAmount
    products.value[productIndex].bestBid = bidAmount
    products.value[productIndex].bestBidder = authStore.user?.id || 'currentUser'

    showNotification(
      `Vaša ponuda od ${bidAmount}€ za ${product.name} je uspješno postavljena!`,
      'success',
      'pi pi-money-bill',
    )

    // Here you would typically send this to the backend
    console.log(`New bid placed:`, {
      productId: product.id,
      productName: product.name,
      bidAmount: bidAmount,
      previousPrice: product.currentPrice,
      userId: authStore.user?.id,
      timestamp: new Date().toISOString(),
    })
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
  padding: 2rem;
}

.main-content h2 {
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  justify-items: center;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .products-grid {
    gap: 1.5rem;
    padding: 0;
  }

  .notification {
    right: 0.5rem;
    left: 0.5rem;
    padding: 0.875rem 1.25rem;
  }
}
</style>
