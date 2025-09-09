<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="admin-header">
        <h2>Administratorska ploča</h2>
        <p>Upravljanje proizvodima i korisnicima</p>
      </div>

      <!-- Navigation Tabs -->
      <AdminTabs :active-tab="activeTab" @update:active-tab="activeTab = $event" />

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Products Management -->
        <ProductsManagement
          v-if="activeTab === 'products'"
          :products="products"
          :loading="loading"
          @edit-product="editProduct"
          @delete-product="deleteProduct"
        />

        <!-- Add Product -->
        <div v-if="activeTab === 'add-product'" class="add-product-section">
          <AddProductForm @product-added="handleProductAdded" @cancel="activeTab = 'products'" />
        </div>

        <!-- Edit Product -->
        <div v-if="activeTab === 'edit-product' && editingProduct" class="edit-product-section">
          <EditProductForm
            :product="editingProduct"
            @product-updated="handleProductUpdated"
            @cancel="cancelEdit"
          />
        </div>

        <!-- Users Management -->
        <UsersManagement
          v-if="activeTab === 'users'"
          :users="users"
          :loading="loadingUsers"
          :current-user-id="authStore.user?._id"
          @promote-user="promoteToAdmin"
          @demote-user="demoteFromAdmin"
          @delete-user="deleteUser"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import AddProductForm from '../components/AddProductForm.vue'
import EditProductForm from '../components/EditProductForm.vue'
import AdminTabs from '../components/AdminTabs.vue'
import ProductsManagement from '../components/ProductsManagement.vue'
import UsersManagement from '../components/UsersManagement.vue'
import { userService, productService } from '../services/api.js'

const authStore = useAuthStore()
const router = useRouter()

// State
const activeTab = ref('products')
const products = ref([])
const users = ref([])
const loading = ref(true)
const loadingUsers = ref(false)
const editingProduct = ref(null)

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
    const response = await productService.getProducts()
    products.value = response.data
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const response = await userService.getUsers()
    users.value = response.data
  } catch (error) {
    console.error('Error loading users:', error)
    alert('Greška pri učitavanju korisnika')
  } finally {
    loadingUsers.value = false
  }
}

const promoteToAdmin = async (userId, userName) => {
  if (!confirm(`Jeste li sigurni da želite promovirati ${userName} u administratora?`)) {
    return
  }

  try {
    await userService.promoteUser(userId)
    await loadUsers() // Refresh the users list
    alert(`${userName} je uspješno promoviran u administratora!`)
  } catch (error) {
    console.error('Error promoting user:', error)
    alert('Greška pri promovingu korisnika')
  }
}

const demoteFromAdmin = async (userId, userName) => {
  if (!confirm(`Jeste li sigurni da želite ukloniti admin privilegije od ${userName}?`)) {
    return
  }

  try {
    // You might need to implement a demote endpoint in your backend
    // For now, this is a placeholder
    console.log('Demote functionality needs backend implementation')
    alert('Ova funkcionalnost će biti implementirana uskoro')
  } catch (error) {
    console.error('Error demoting user:', error)
    alert('Greška pri uklanjanju admin privilegija')
  }
}

const deleteUser = async (userId, userName) => {
  if (
    !confirm(
      `Jeste li sigurni da želite obrisati korisnika ${userName}? Ova akcija se ne može poništiti.`,
    )
  ) {
    return
  }

  try {
    await userService.deleteUser(userId)
    users.value = users.value.filter((u) => u._id !== userId)
    alert(`Korisnik ${userName} je uspješno obrisan.`)
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Greška pri brisanju korisnika')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
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
    await productService.deleteProduct(productId)
    products.value = products.value.filter((p) => p._id !== productId)
    alert('Proizvod je uspješno obrisan.')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Greška pri brisanju proizvoda')
  }
}

const editProduct = (productId) => {
  const product = products.value.find((p) => p._id === productId)
  if (product) {
    editingProduct.value = product
    activeTab.value = 'edit-product'
  }
}

const handleProductUpdated = (updatedProduct) => {
  // Update the product in the products array
  const index = products.value.findIndex((p) => p._id === updatedProduct._id)
  if (index !== -1) {
    products.value[index] = updatedProduct
  }

  // Clear editing state and return to products tab
  editingProduct.value = null
  activeTab.value = 'products'
}

const cancelEdit = () => {
  editingProduct.value = null
  activeTab.value = 'products'
}

// Lifecycle
onMounted(() => {
  loadProducts()
})

// Watch for tab changes to load users when needed
watch(activeTab, (newTab) => {
  if (newTab === 'users' && users.value.length === 0) {
    loadUsers()
  }
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

.user-count {
  background: #e8f5e8;
  color: #2e7d2e;
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

/* Users Management Styles */
.users-table-container {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.users-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 15px 20px;
  text-align: left;
  border-bottom: 2px solid #e1e5e9;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.user-icon {
  color: #2a5298;
  font-size: 1.1rem;
}

.user-email {
  color: #666;
  font-family: monospace;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.admin {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.user-date {
  color: #666;
  font-size: 0.9rem;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.current-user-label {
  color: #2a5298;
  font-style: italic;
  font-size: 0.9rem;
  font-weight: 600;
}

.no-users {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-users-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 10px;
  }

  .tab-content {
    padding: 20px;
  }
}
</style>
