<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="admin-header">
        <h2>Administratorska ploča</h2>
        <p>Upravljanje proizvodima i korisnicima</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          <i class="pi pi-box"></i>
          Upravljanje proizvodima
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'add-product' }"
          @click="activeTab = 'add-product'"
        >
          <i class="pi pi-plus"></i>
          Dodaj proizvod
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <i class="pi pi-users"></i>
          Korisnici
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Products Management -->
        <div v-if="activeTab === 'products'" class="products-section">
          <div class="section-header">
            <h3>Svi proizvodi</h3>
            <span class="product-count">{{ products.length }} proizvoda</span>
          </div>

          <div v-if="loading" class="loading-container">
            <i class="pi pi-spin pi-spinner loading-icon"></i>
            <span>Učitavanje proizvoda...</span>
          </div>

          <div v-else class="products-grid">
            <div v-for="product in products" :key="product._id" class="product-card">
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
                <Button icon="pi pi-pencil" class="p-button-sm p-button-outlined" title="Uredi" />
                <Button
                  icon="pi pi-trash"
                  class="p-button-sm p-button-outlined p-button-danger"
                  title="Obriši"
                  @click="deleteProduct(product._id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Add Product -->
        <div v-if="activeTab === 'add-product'" class="add-product-section">
          <AddProductForm @product-added="handleProductAdded" @cancel="activeTab = 'products'" />
        </div>

        <!-- Users Management -->
        <div v-if="activeTab === 'users'" class="users-section">
          <div class="section-header">
            <h3>Registrirani korisnici</h3>
          </div>
          <p class="coming-soon">Ova funkcionalnost će biti dostupna uskoro...</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import AddProductForm from '../components/AddProductForm.vue'
import Button from 'primevue/button'

const authStore = useAuthStore()
const router = useRouter()

// State
const activeTab = ref('products')
const products = ref([])
const loading = ref(true)

// Check if user is admin (this should be implemented in your auth system)
if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
  // For now, allow all logged users to access admin - adjust as needed
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
}

// Methods
const loadProducts = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:3000/api/products')
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const handleProductAdded = (newProduct) => {
  products.value.unshift(newProduct)
  activeTab.value = 'products'
}

const deleteProduct = async (productId) => {
  if (!confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')) {
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      products.value = products.value.filter((p) => p._id !== productId)
    } else {
      alert('Greška pri brisanju proizvoda')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Greška pri brisanju proizvoda')
  }
}

// Lifecycle
onMounted(() => {
  loadProducts()
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
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.admin-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.admin-header h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.admin-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.admin-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: transparent;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
  background: white;
  color: #2a5298;
  font-weight: 600;
}

.tab-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

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

.coming-soon {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 60px 20px;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 10px;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .tab-content {
    padding: 20px;
  }

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
