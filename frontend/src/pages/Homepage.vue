<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Dobrodošli u KuPro</h1>
          <p class="hero-subtitle">Vaša trgovina za jedinstvene proizvode i licitacije</p>
          <div class="hero-buttons">
            <button class="cta-button primary" @click="$router.push('/products')">
              <i class="pi pi-shopping-bag"></i>
              Pregledaj proizvode
            </button>
            <button class="cta-button secondary" @click="$router.push('/register')">
              <i class="pi pi-user-plus"></i>
              Pridruži se
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Ads Section -->
      <div class="recent-ads-section">
        <div class="container">
          <h2>Najnoviji oglasi</h2>
          <div v-if="loading" class="loading-container">
            <i class="pi pi-spin pi-spinner loading-icon"></i>
            <p>Učitavam najnovije oglase...</p>
          </div>
          <div v-else-if="recentAds.length > 0" class="ads-grid">
            <Card
              v-for="product in recentAds"
              :key="product._id"
              :id="product._id"
              :name="product.name"
              :image="product.image"
              :current-price="product.currentPrice"
              :original-price="product.originalPrice"
              :is-bidding="product.isBidding"
              :best-bidder="product.bestBidder"
              @view-product="viewProduct(product._id)"
              @add-to-cart="addToCart(product)"
              @place-bid="placeBid(product._id, $event)"
            />
          </div>
          <div v-else class="no-ads">
            <i class="pi pi-inbox no-ads-icon"></i>
            <h3>Nema najnovijih oglasa</h3>
            <p>Budite prvi koji će objaviti oglas!</p>
            <button class="cta-button primary" @click="$router.push('/admin')">
              <i class="pi pi-plus"></i>
              Dodaj oglas
            </button>
          </div>
          <div class="view-all-container">
            <button class="view-all-btn" @click="$router.push('/products')">
              <span>Pogledaj sve oglase</span>
              <i class="pi pi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="features-section">
        <div class="container">
          <h2>Zašto odabrati KuPro?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <i class="pi pi-shield feature-icon"></i>
              <h3>Sigurna kupovina</h3>
              <p>Vaše transakcije su zaštićene najnovijim sigurnosnim protokolima</p>
            </div>
            <div class="feature-card">
              <i class="pi pi-clock feature-icon"></i>
              <h3>Brza dostava</h3>
              <p>Dostava u roku od 24-48 sati za sve proizvode na zalihama</p>
            </div>
            <div class="feature-card">
              <i class="pi pi-star feature-icon"></i>
              <h3>Kvalitetni proizvodi</h3>
              <p>Pažljivo odabrani proizvodi od provjerenih prodavatelja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Card from '@/components/Card.vue'
import { productService } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const recentAds = ref([])
const loading = ref(true)

// Fetch recent ads on component mount
onMounted(async () => {
  try {
    const response = await productService.getProducts()
    // Get the 6 most recent products (sorted by creation date, newest first)
    recentAds.value = response.data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
  } catch (error) {
    console.error('Error fetching recent ads:', error)
  } finally {
    loading.value = false
  }
})

// Navigation functions
const viewProduct = (productId) => {
  router.push(`/products/${productId}`)
}

const addToCart = (product) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Add to cart logic here
  console.log('Adding to cart:', product)
  // You can implement cart functionality here
}

const placeBid = async (productId, bidAmount) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    // Place bid logic here
    console.log('Placing bid:', productId, bidAmount)
    // You can implement bid functionality here
  } catch (error) {
    console.error('Error placing bid:', error)
  }
}
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
}

.main-content {
  flex: 1;
  margin: 0;
  padding: 0;
}

.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 120px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.cta-button.primary {
  background: white;
  color: #2a5298;
}

.cta-button.primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background: white;
  color: #2a5298;
  transform: translateY(-2px);
}

/* Recent Ads Section */
.recent-ads-section {
  padding: 80px 20px;
  background: white;
}

.recent-ads-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #2a5298;
  margin-bottom: 50px;
  font-weight: 700;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-icon {
  font-size: 2rem;
  color: #2a5298;
  margin-bottom: 20px;
}

.ads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.no-ads {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-ads-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

.no-ads h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.no-ads p {
  font-size: 1rem;
  margin-bottom: 30px;
}

.view-all-container {
  text-align: center;
}

.view-all-btn {
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
  text-decoration: none;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 82, 152, 0.3);
}

.features-section {
  padding: 80px 20px;
  background: #f8f9fa;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #2a5298;
  margin-bottom: 60px;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #2a5298;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 250px;
    justify-content: center;
  }

  .recent-ads-section {
    padding: 60px 20px;
  }

  .recent-ads-section h2 {
    font-size: 2rem;
    margin-bottom: 40px;
  }

  .ads-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }

  .no-ads {
    padding: 40px 20px;
  }

  .no-ads-icon {
    font-size: 3rem;
  }

  .view-all-btn {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }

  .features-section {
    padding: 60px 20px;
  }

  .features-grid {
    gap: 30px;
  }

  .feature-card {
    padding: 30px 20px;
  }
}
</style>
