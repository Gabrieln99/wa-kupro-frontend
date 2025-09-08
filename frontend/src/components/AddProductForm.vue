<template>
  <div class="add-product-form">
    <div class="form-header">
      <h3>Dodaj novi proizvod</h3>
      <p>Ispunite sve potrebne informacije o vašem proizvodu</p>
    </div>

    <form @submit.prevent="handleSubmit" class="product-form">
      <!-- Product Name -->
      <div class="form-group">
        <label for="productName" class="form-label">Naziv proizvoda *</label>
        <input
          id="productName"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ error: errors.name }"
          placeholder="Unesite naziv proizvoda"
          required
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category" class="form-label">Kategorija *</label>
        <select
          id="category"
          v-model="formData.category"
          class="form-input"
          :class="{ error: errors.category }"
          required
        >
          <option value="">Odaberite kategoriju</option>
          <option value="Elektronika">Elektronika</option>
          <option value="Namještaj">Namještaj</option>
          <option value="Odjeća">Odjeća</option>
          <option value="Knjige">Knjige</option>
          <option value="Sport">Sport</option>
          <option value="Igračke">Igračke</option>
          <option value="Antikviteti">Antikviteti</option>
          <option value="Satovi">Satovi</option>
          <option value="Računala">Računala</option>
          <option value="Glazbala">Glazbala</option>
          <option value="Ostalo">Ostalo</option>
        </select>
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <!-- Image Upload -->
      <div class="form-group">
        <ImageUpload
          v-model="formData.image"
          label="Slika proizvoda"
          :class="{ error: errors.image }"
        />
        <span v-if="errors.image" class="error-message">{{ errors.image }}</span>
      </div>

      <!-- Price and Sale Type -->
      <div class="form-row">
        <div class="form-group half-width">
          <label for="price" class="form-label">Cijena (€) *</label>
          <input
            id="price"
            v-model.number="formData.currentPrice"
            type="number"
            min="0.01"
            step="0.01"
            class="form-input"
            :class="{ error: errors.currentPrice }"
            placeholder="0.00"
            required
          />
          <span v-if="errors.currentPrice" class="error-message">{{ errors.currentPrice }}</span>
        </div>

        <div class="form-group half-width">
          <label class="form-label">Tip prodaje *</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="formData.isBidding" :value="false" name="saleType" />
              <span class="radio-custom"></span>
              Direktna prodaja
            </label>
            <label class="radio-label">
              <input type="radio" v-model="formData.isBidding" :value="true" name="saleType" />
              <span class="radio-custom"></span>
              Licitacija
            </label>
          </div>
        </div>
      </div>

      <!-- Color and Stock -->
      <div class="form-row">
        <div class="form-group half-width">
          <label for="color" class="form-label">Boja</label>
          <input
            id="color"
            v-model="formData.color"
            type="text"
            class="form-input"
            placeholder="Npr. Crna, Bijela, Crvena"
          />
        </div>

        <div class="form-group half-width">
          <label for="stock" class="form-label">Količina na skladištu *</label>
          <input
            id="stock"
            v-model.number="formData.stock"
            type="number"
            min="1"
            class="form-input"
            :class="{ error: errors.stock }"
            placeholder="1"
            required
          />
          <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
        </div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description" class="form-label">Opis proizvoda *</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-textarea"
          :class="{ error: errors.description }"
          placeholder="Detaljno opišite vaš proizvod, stanje, značajke..."
          rows="4"
          required
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        <div class="character-count">{{ formData.description.length }}/500 znakova</div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <Button
          type="button"
          label="Odustani"
          icon="pi pi-times"
          class="secondary-btn"
          @click="handleCancel"
        />
        <Button
          type="submit"
          label="Dodaj proizvod"
          icon="pi pi-plus"
          class="primary-btn"
          :disabled="loading || !isFormValid"
          :loading="loading"
        />
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="notification" class="notification" :class="notification.type">
      <i :class="notification.icon"></i>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import Button from 'primevue/button'
import ImageUpload from './ImageUpload.vue'

// Emits
const emit = defineEmits(['product-added', 'cancel'])

// Store
const authStore = useAuthStore()

// State
const loading = ref(false)
const notification = ref(null)

// Form data
const formData = reactive({
  name: '',
  category: '',
  image: '',
  currentPrice: null,
  originalPrice: null,
  color: '',
  stock: 1,
  description: '',
  isBidding: false,
})

// Form errors
const errors = reactive({
  name: '',
  category: '',
  image: '',
  currentPrice: '',
  stock: '',
  description: '',
})

// Computed
const isFormValid = computed(() => {
  return (
    formData.name.trim() &&
    formData.category &&
    formData.image.trim() &&
    formData.currentPrice > 0 &&
    formData.stock > 0 &&
    formData.description.trim().length >= 10 &&
    formData.description.length <= 500
  )
})

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))
  let isValid = true

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Naziv proizvoda je obavezan'
    isValid = false
  } else if (formData.name.length < 3) {
    errors.name = 'Naziv mora imati najmanje 3 znaka'
    isValid = false
  }

  // Category validation
  if (!formData.category) {
    errors.category = 'Molimo odaberite kategoriju'
    isValid = false
  }

  // Image validation
  if (!formData.image.trim()) {
    errors.image = 'Slika je obavezna'
    isValid = false
  }

  // Price validation
  if (!formData.currentPrice || formData.currentPrice <= 0) {
    errors.currentPrice = 'Cijena mora biti veća od 0'
    isValid = false
  }

  // Stock validation
  if (!formData.stock || formData.stock < 1) {
    errors.stock = 'Količina mora biti najmanje 1'
    isValid = false
  }

  // Description validation
  if (!formData.description.trim()) {
    errors.description = 'Opis proizvoda je obavezan'
    isValid = false
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Opis mora imati najmanje 10 znakova'
    isValid = false
  } else if (formData.description.length > 500) {
    errors.description = 'Opis može imati maksimalno 500 znakova'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showNotification('Molimo ispravite greške u formi', 'error')
    return
  }

  loading.value = true

  try {
    // Prepare product data
    const productData = {
      ...formData,
      originalPrice: formData.currentPrice,
      bestBidder: null,
      userId: authStore.user?.id,
      userEmail: authStore.user?.email,
    }

    // Send to backend
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(productData),
    })

    if (response.ok) {
      const newProduct = await response.json()
      showNotification('Proizvod je uspješno dodan!', 'success')
      resetForm()
      emit('product-added', newProduct)
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Greška pri dodavanju proizvoda')
    }
  } catch (error) {
    console.error('Error adding product:', error)
    showNotification(error.message || 'Greška pri dodavanju proizvoda', 'error')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    category: '',
    image: '',
    currentPrice: null,
    originalPrice: null,
    color: '',
    stock: 1,
    description: '',
    isBidding: false,
  })

  Object.keys(errors).forEach((key) => (errors[key] = ''))
}

const showNotification = (message, type) => {
  notification.value = {
    message,
    type,
    icon: type === 'success' ? 'pi pi-check' : 'pi pi-times',
  }

  setTimeout(() => {
    notification.value = null
  }, 4000)
}
</script>

<style scoped>
.add-product-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.form-header h3 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.half-width {
  width: 100%;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-textarea {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2a5298;
  box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #dc3545;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.character-count {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.radio-label input[type='radio'] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-label input[type='radio']:checked + .radio-custom {
  border-color: #2a5298;
  background: #2a5298;
}

.radio-label input[type='radio']:checked + .radio-custom::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.primary-btn,
.secondary-btn {
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 140px;
}

.primary-btn {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(42, 82, 152, 0.3);
}

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-btn {
  background: white;
  color: #666;
  border-color: #e1e5e9;
}

.secondary-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

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
  min-width: 300px;
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
  .add-product-form {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
  }

  .notification {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>
