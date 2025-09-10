<template>
  <div class="edit-product-form">
    <div class="form-header">
      <h3>Uredi proizvod</h3>
      <p>Uredite informacije o vašem proizvodu</p>
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

      <!-- Price (only if no active bids) -->
      <div v-if="!hasActiveBids" class="form-row">
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

        <div v-if="!product.isBidding" class="form-group half-width">
          <label for="stock" class="form-label">Skladište *</label>
          <input
            id="stock"
            v-model.number="formData.stock"
            type="number"
            min="0"
            class="form-input"
            :class="{ error: errors.stock }"
            placeholder="0"
            required
          />
          <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
        </div>
      </div>

      <!-- Bidding restriction notice -->
      <div v-if="hasActiveBids" class="restriction-notice">
        <i class="pi pi-info-circle"></i>
        <p>Proizvod ima aktivne ponude - cijena i postavke licitacije se ne mogu mijenjati.</p>
      </div>

      <!-- Color and Size -->
      <div class="form-row">
        <div class="form-group half-width">
          <label for="color" class="form-label">Boja</label>
          <input
            id="color"
            v-model="formData.color"
            type="text"
            class="form-input"
            placeholder="npr. Crvena, Plava..."
          />
        </div>

        <div class="form-group half-width">
          <label for="size" class="form-label">Veličina</label>
          <input
            id="size"
            v-model="formData.size"
            type="text"
            class="form-input"
            placeholder="npr. M, L, XL..."
          />
        </div>
      </div>

      <!-- Brand and Material -->
      <div class="form-row">
        <div class="form-group half-width">
          <label for="brand" class="form-label">Marka</label>
          <input
            id="brand"
            v-model="formData.brand"
            type="text"
            class="form-input"
            placeholder="Marka proizvoda"
          />
        </div>

        <div class="form-group half-width">
          <label for="material" class="form-label">Materijal</label>
          <input
            id="material"
            v-model="formData.material"
            type="text"
            class="form-input"
            placeholder="npr. Pamuk, Drvo..."
          />
        </div>
      </div>

      <!-- Condition -->
      <div class="form-group">
        <label for="condition" class="form-label">Stanje proizvoda *</label>
        <select
          id="condition"
          v-model="formData.condition"
          class="form-input"
          :class="{ error: errors.condition }"
          required
        >
          <option value="">Odaberite stanje</option>
          <option value="novo">Novo</option>
          <option value="kao novo">Kao novo</option>
          <option value="dobro">Dobro</option>
          <option value="zadovoljavajuće">Zadovoljavajuće</option>
          <option value="potrebne popravke">Potrebne popravke</option>
        </select>
        <span v-if="errors.condition" class="error-message">{{ errors.condition }}</span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description" class="form-label">Opis proizvoda *</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-textarea"
          :class="{ error: errors.description }"
          rows="4"
          placeholder="Detaljno opišite vaš proizvod..."
          required
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <!-- Bidding Settings (only if no active bids and is bidding product) -->
      <div v-if="product.isBidding && !hasActiveBids" class="bidding-section">
        <h4>Postavke licitacije</h4>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="biddingDuration" class="form-label">Trajanje licitacije (dani)</label>
            <input
              id="biddingDuration"
              v-model.number="formData.biddingDurationDays"
              type="number"
              min="1"
              max="30"
              class="form-input"
              placeholder="7"
            />
          </div>

          <div class="form-group half-width">
            <label for="minimumIncrement" class="form-label">Minimalni prirast (€)</label>
            <input
              id="minimumIncrement"
              v-model.number="formData.minimumBidIncrement"
              type="number"
              min="0.01"
              step="0.01"
              class="form-input"
              placeholder="1.00"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <Button
          type="button"
          label="Odustani"
          icon="pi pi-times"
          class="p-button-text p-button-secondary"
          @click="$emit('cancel')"
        />
        <Button
          type="submit"
          label="Spremi promjene"
          icon="pi pi-check"
          :loading="isSubmitting"
          class="p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import ImageUpload from './ImageUpload.vue'
import { productService } from '../services/api.js'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['product-updated', 'cancel'])

// State
const isSubmitting = ref(false)
const errors = reactive({})

// Form data - initialize with product data
const formData = reactive({
  name: '',
  category: '',
  description: '',
  currentPrice: 0,
  stock: 0,
  image: '',
  color: '',
  size: '',
  brand: '',
  material: '',
  condition: '',
  biddingDurationDays: 7,
  minimumBidIncrement: 1.0,
})

// Check if product has active bids
const hasActiveBids = computed(() => {
  return (
    props.product.isBidding &&
    props.product.biddingStatus === 'active' &&
    props.product.bidHistory &&
    props.product.bidHistory.length > 0
  )
})

// Initialize form data with product values
const initializeForm = () => {
  Object.keys(formData).forEach((key) => {
    if (props.product[key] !== undefined && props.product[key] !== null) {
      formData[key] = props.product[key]
    }
  })
}

// Validation
const validateForm = () => {
  const newErrors = {}

  if (!formData.name.trim()) {
    newErrors.name = 'Naziv proizvoda je obavezan'
  }

  if (!formData.category) {
    newErrors.category = 'Kategorija je obavezna'
  }

  if (!formData.description.trim()) {
    newErrors.description = 'Opis proizvoda je obavezan'
  }

  if (!formData.currentPrice || formData.currentPrice <= 0) {
    newErrors.currentPrice = 'Cijena mora biti veća od 0'
  }

  if (!props.product.isBidding && (!formData.stock || formData.stock < 0)) {
    newErrors.stock = 'Skladište mora biti 0 ili veće'
  }

  if (!formData.condition) {
    newErrors.condition = 'Stanje proizvoda je obavezno'
  }

  if (!formData.image.trim()) {
    newErrors.image = 'Slika proizvoda je obavezna'
  }

  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  // Set new errors
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const updateData = { ...formData }

    // Remove unchanged fields to minimize update payload
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === props.product[key]) {
        delete updateData[key]
      }
    })

    const response = await productService.updateProduct(props.product._id, updateData)

    emit('product-updated', response.data.product)

    // Show success message
    alert('Proizvod je uspješno ažuriran!')
  } catch (error) {
    console.error('Error updating product:', error)

    if (error.response?.data?.errors) {
      // Handle validation errors from backend
      error.response.data.errors.forEach((err) => {
        const field = err.toLowerCase()
        if (field.includes('name') || field.includes('naziv')) errors.name = err
        if (field.includes('category') || field.includes('kategorija')) errors.category = err
        if (field.includes('price') || field.includes('cijena')) errors.currentPrice = err
        if (field.includes('description') || field.includes('opis')) errors.description = err
      })
    } else {
      alert(error.response?.data?.message || 'Greška pri ažuriranju proizvoda')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Initialize form when component mounts
onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.edit-product-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  margin: 0 0 10px 0;
}

.form-header p {
  color: #666;
  margin: 0;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.half-width {
  flex: 1;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fff;
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
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
}

.restriction-notice {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #856404;
}

.restriction-notice i {
  font-size: 1.2rem;
}

.restriction-notice p {
  margin: 0;
  font-weight: 500;
}

.bidding-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.bidding-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-product-form {
    padding: 20px;
    margin: 10px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
  }
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  .edit-product-form {
    background: #1f2937 !important;
    color: #f9fafb !important;
  }

  .form-header h3,
  .form-header p,
  .form-label {
    color: #f9fafb !important;
  }

  .form-input,
  .form-textarea {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .form-input:hover,
  .form-textarea:hover {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .form-input:focus,
  .form-textarea:focus {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #3b82f6 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .form-input.error,
  .form-textarea.error {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #ef4444 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .checkbox-group label {
    color: #f9fafb !important;
  }

  .image-upload-area {
    background: #374151 !important;
    border-color: #4b5563 !important;
    color: #f9fafb !important;
  }

  .form-actions {
    border-color: #374151 !important;
  }
}
</style>
