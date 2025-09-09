<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <!-- Loading State for User Profile -->
      <div v-if="userLoading" class="loading-container">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <span>Učitavanje korisničkih podataka...</span>
      </div>

      <!-- Profile Content -->
      <div v-else>
        <div class="profile-header">
          <div class="user-info">
            <div class="avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="user-details">
              <h2>
                {{
                  authStore.user?.name && authStore.user?.surname
                    ? `${authStore.user.name} ${authStore.user.surname}`
                    : authStore.user?.username || 'Korisnik'
                }}
              </h2>
              <p>{{ authStore.user?.email || 'Email nije dostupan' }}</p>
              <span class="member-since">Član od {{ memberSince }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="profile-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'my-products' }"
            @click="activeTab = 'my-products'"
          >
            <i class="pi pi-box"></i>
            Moji proizvodi
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
            :class="{ active: activeTab === 'bids' }"
            @click="activeTab = 'bids'"
          >
            <i class="pi pi-money-bill"></i>
            Moje ponude
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <i class="pi pi-cog"></i>
            Postavke
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- My Products -->
          <div v-if="activeTab === 'my-products'" class="my-products-section">
            <div class="section-header">
              <h3>Moji proizvodi</h3>
              <span class="product-count">{{ myProducts.length }} proizvoda</span>
            </div>

            <div v-if="loading" class="loading-container">
              <i class="pi pi-spin pi-spinner loading-icon"></i>
              <span>Učitavanje proizvoda...</span>
            </div>

            <div v-else-if="myProducts.length === 0" class="empty-state">
              <i class="pi pi-inbox"></i>
              <h4>Nemate objavljene proizvode</h4>
              <p>Dodajte svoj prvi proizvod klikom na "Dodaj proizvod"</p>
              <Button
                label="Dodaj proizvod"
                icon="pi pi-plus"
                @click="activeTab = 'add-product'"
                class="primary-btn"
              />
            </div>

            <div v-else class="products-grid">
              <div v-for="product in myProducts" :key="product._id" class="product-card">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-info">
                  <h4>{{ product.name }}</h4>
                  <p class="category">{{ product.category }}</p>
                  <p class="price">{{ product.currentPrice }} €</p>
                  <p class="stock">Skladište: {{ product.stock }} kom</p>
                  <span class="sale-type" :class="product.isBidding ? 'bidding' : 'direct'">
                    {{ product.isBidding ? 'Licitacija' : 'Direktna prodaja' }}
                  </span>
                  <p class="created-date">Objavljeno: {{ formatDate(product.createdAt) }}</p>
                </div>
                <div class="product-actions">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm p-button-outlined"
                    title="Pogledaj"
                    @click="viewProduct(product._id)"
                  />
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-sm p-button-outlined"
                    title="Uredi"
                    @click="editProduct(product)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-outlined p-button-danger"
                    title="Obriši"
                    @click="deleteMyProduct(product._id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Add Product -->
          <div v-if="activeTab === 'add-product'" class="add-product-section">
            <AddProductForm
              @product-added="handleProductAdded"
              @cancel="activeTab = 'my-products'"
            />
          </div>

          <!-- Edit Product -->
          <div v-if="activeTab === 'edit-product' && editingProduct" class="edit-product-section">
            <EditProductForm
              :product="editingProduct"
              @product-updated="handleProductUpdated"
              @cancel="cancelEdit"
            />
          </div>

          <!-- My Bids -->
          <div v-if="activeTab === 'bids'" class="bids-section">
            <div class="section-header">
              <h3>Moje ponude</h3>
            </div>
            <p class="coming-soon">Ova funkcionalnost će biti dostupna uskoro...</p>
          </div>

          <!-- Settings -->
          <div v-if="activeTab === 'settings'" class="settings-section">
            <div class="section-header">
              <h3>Postavke računa</h3>
            </div>
            <div class="settings-content">
              <div class="setting-item">
                <label>Ime i prezime</label>
                <input
                  type="text"
                  :value="
                    authStore.user?.name && authStore.user?.surname
                      ? `${authStore.user.name} ${authStore.user.surname}`
                      : 'Nije dostupno'
                  "
                  readonly
                />
              </div>
              <div class="setting-item">
                <label>Korisničko ime</label>
                <input type="text" :value="authStore.user?.username || 'Nije dostupno'" readonly />
              </div>
              <div class="setting-item">
                <label>Email adresa</label>
                <input type="email" :value="authStore.user?.email || 'Nije dostupno'" readonly />
              </div>
              <div class="setting-item">
                <label>Adresa</label>
                <input type="text" :value="authStore.user?.address || 'Nije dostupno'" readonly />
              </div>
              <div class="setting-item">
                <label>OIB</label>
                <input type="text" :value="authStore.user?.oib || 'Nije dostupno'" readonly />
              </div>
              <div class="setting-actions">
                <Button label="Promijeni lozinku" icon="pi pi-key" class="p-button-outlined" />
                <Button
                  label="Odjavi se"
                  icon="pi pi-sign-out"
                  class="p-button-danger"
                  @click="logout"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Close profile content -->
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import AddProductForm from '../components/AddProductForm.vue'
import EditProductForm from '../components/EditProductForm.vue'
import Button from 'primevue/button'

const authStore = useAuthStore()
const router = useRouter()

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  console.log('🚫 UserProfile: User not authenticated, redirecting to login')
  router.push('/login')
} else if (!authStore.user) {
  console.log('⚠️ UserProfile: Token exists but no user data - clearing auth state')
  authStore.clearAuthState()
  router.push('/login')
}

// State
const activeTab = ref('my-products')
const myProducts = ref([])
const loading = ref(true)
const userLoading = ref(true)
const editingProduct = ref(null)

// Computed
const memberSince = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).getFullYear()
  }
  return new Date().getFullYear()
})

// Methods
const ensureUserProfile = async () => {
  userLoading.value = true
  console.log('Current auth store user:', authStore.user)
  console.log('User has ID:', authStore.user?.id)
  console.log('User has email:', authStore.user?.email)

  // Check if we have basic user data but missing profile details
  if (authStore.user?.id && !authStore.user?.email) {
    try {
      console.log('Fetching user profile...')
      await authStore.fetchUserProfile()
      console.log('User profile fetched:', authStore.user)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }
  userLoading.value = false
}

const loadMyProducts = async () => {
  try {
    loading.value = true
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/products`)
    if (response.ok) {
      const allProducts = await response.json()
      // Filter products by current user (you might want to add user filtering in backend)
      myProducts.value = allProducts.filter(
        (product) =>
          product.userEmail === authStore.user?.email || product.userId === authStore.user?.id,
      )
    }
  } catch (error) {
    console.error('Error loading my products:', error)
  } finally {
    loading.value = false
  }
}

const handleProductAdded = (newProduct) => {
  myProducts.value.unshift(newProduct)
  activeTab.value = 'my-products'
}

const editProduct = (product) => {
  editingProduct.value = product
  activeTab.value = 'edit-product'
}

const handleProductUpdated = (updatedProduct) => {
  // Update the product in the myProducts array
  const index = myProducts.value.findIndex((p) => p._id === updatedProduct._id)
  if (index !== -1) {
    myProducts.value[index] = updatedProduct
  }

  // Clear editing state and return to my products tab
  editingProduct.value = null
  activeTab.value = 'my-products'
}

const cancelEdit = () => {
  editingProduct.value = null
  activeTab.value = 'my-products'
}

const viewProduct = (productId) => {
  router.push(`/products/${productId}`)
}

const deleteMyProduct = async (productId) => {
  if (!confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')) {
    return
  }

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    if (response.ok) {
      myProducts.value = myProducts.value.filter((p) => p._id !== productId)
    } else {
      alert('Greška pri brisanju proizvoda')
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Greška pri brisanju proizvoda')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('hr-HR')
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

// Lifecycle
onMounted(async () => {
  await ensureUserProfile()
  await loadMyProducts()
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

.profile-header {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #2a5298;
}

.user-details h2 {
  color: white;
  margin: 0 0 5px 0;
  font-size: 1.8rem;
}

.user-details p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.member-since {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.profile-tabs {
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h4 {
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  margin-bottom: 25px;
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
  margin: 0 0 5px 0;
}

.created-date {
  color: #999;
  font-size: 0.8rem;
  margin: 5px 0 0 0;
}

.sale-type {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 5px;
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

.settings-content {
  max-width: 400px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.setting-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}

.setting-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.primary-btn {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(42, 82, 152, 0.3);
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

  .profile-tabs {
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

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .setting-actions {
    flex-direction: column;
  }
}
</style>
