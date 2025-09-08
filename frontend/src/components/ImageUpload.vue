<template>
  <div class="image-upload-container">
    <label class="form-label">{{ label }} *</label>

    <!-- Upload Method Tabs -->
    <div class="upload-tabs">
      <button
        v-if="uploadEnabled"
        type="button"
        class="tab-btn"
        :class="{ active: uploadMethod === 'file' }"
        @click="uploadMethod = 'file'"
      >
        <i class="pi pi-upload"></i>
        Učitaj sliku
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: uploadMethod === 'url' }"
        @click="uploadMethod = 'url'"
      >
        <i class="pi pi-link"></i>
        URL slike
      </button>
    </div>

    <!-- File Upload Section -->
    <div v-if="uploadMethod === 'file'" class="upload-section">
      <div
        class="dropzone"
        :class="{
          'drag-over': isDragging,
          'has-file': selectedFile,
          uploading: isUploading,
        }"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          @change="handleFileSelect"
        />

        <div v-if="!selectedFile && !isUploading" class="dropzone-content">
          <i class="pi pi-cloud-upload upload-icon"></i>
          <h4>Povucite sliku ovdje ili kliknite za odabir</h4>
          <p>Podržani formati: JPG, PNG, GIF, WebP (max 10MB)</p>
        </div>

        <div v-if="selectedFile && !isUploading" class="file-info">
          <i class="pi pi-file file-icon"></i>
          <div class="file-details">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button type="button" class="remove-btn" @click.stop="removeFile">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div v-if="isUploading" class="uploading-state">
          <i class="pi pi-spin pi-spinner upload-spinner"></i>
          <p>Učitavanje slike...</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="upload-actions">
        <button
          type="button"
          class="upload-btn"
          :disabled="!selectedFile || isUploading"
          @click="uploadFile"
        >
          <i class="pi pi-upload"></i>
          {{ isUploading ? 'Učitavanje...' : 'Učitaj sliku' }}
        </button>
      </div>

      <div v-if="uploadError" class="error-message">
        <i class="pi pi-exclamation-triangle"></i>
        {{ uploadError }}
      </div>
    </div>

    <!-- URL Input Section -->
    <div v-if="uploadMethod === 'url'" class="url-section">
      <input
        v-model="urlInput"
        type="url"
        class="form-input"
        :class="{ error: urlError }"
        placeholder="https://example.com/slika.jpg"
        @input="handleUrlInput"
        @blur="validateUrl"
      />
      <span v-if="urlError" class="error-message">{{ urlError }}</span>

      <div class="url-suggestions">
        <p class="suggestions-title">
          <i class="pi pi-lightbulb"></i>
          Besplatni servisi za hosting slika:
        </p>
        <div class="service-links">
          <a
            v-for="service in backendConfig?.suggestedServices || IMAGE_CONFIG.SUGGESTED_SERVICES"
            :key="service.name"
            :href="service.url"
            target="_blank"
            class="service-link"
            :title="service.description"
          >
            <i class="pi pi-external-link"></i>
            {{ service.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Image Preview -->
    <div v-if="previewUrl" class="image-preview">
      <h4>Pregled slike:</h4>
      <div class="preview-container">
        <img
          :src="previewUrl"
          alt="Pregled slike"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        <button type="button" class="remove-preview-btn" @click="removeImage">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { IMAGE_CONFIG } from '../config/imageConfig.js'

const props = defineProps({
  label: {
    type: String,
    default: 'Slika proizvoda',
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

// State
const uploadMethod = ref('file')
const selectedFile = ref(null)
const urlInput = ref('')
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const urlError = ref('')
const backendConfig = ref(null)
const uploadEnabled = ref(false)

// Computed
const previewUrl = computed(() => {
  if (uploadMethod.value === 'url' && urlInput.value) {
    return urlInput.value
  }
  return props.modelValue || ''
})

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && uploadMethod.value === 'url') {
      urlInput.value = newValue
    }
  },
)

// Load backend configuration on mount
onMounted(async () => {
  try {
    const response = await fetch(`${IMAGE_CONFIG.BACKEND_BASE_URL}${IMAGE_CONFIG.CONFIG_ENDPOINT}`)
    const data = await response.json()

    if (data.success) {
      backendConfig.value = data.data
      uploadEnabled.value = data.data.uploadEnabled

      // If upload is not enabled, default to URL method
      if (!uploadEnabled.value) {
        uploadMethod.value = 'url'
      }
    }
  } catch (error) {
    console.error('Failed to load upload config:', error)
    uploadEnabled.value = false
    uploadMethod.value = 'url'
  }
})

// File upload methods
const triggerFileInput = () => {
  if (!isUploading.value) {
    document.querySelector('.file-input').click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragging.value = false
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  uploadError.value = ''

  const allowedTypes = backendConfig.value?.allowedTypes || IMAGE_CONFIG.ALLOWED_TYPES
  const maxSize = backendConfig.value?.maxFileSize || IMAGE_CONFIG.MAX_FILE_SIZE

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Molimo odaberite sliku (JPG, PNG, GIF, WebP)'
    return
  }

  // Check file size
  if (file.size > maxSize) {
    uploadError.value = `Slika je prevelika. Maksimalna veličina je ${formatFileSize(maxSize)}`
    return
  }

  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  document.querySelector('.file-input').value = ''
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  // Check if upload is enabled
  if (!uploadEnabled.value) {
    uploadError.value = 'Učitavanje datoteka nije omogućeno. Molimo koristite URL opciju.'
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  uploadError.value = ''

  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)

    const response = await fetch(
      `${IMAGE_CONFIG.BACKEND_BASE_URL}${IMAGE_CONFIG.UPLOAD_ENDPOINT}`,
      {
        method: 'POST',
        body: formData,
      },
    )

    const data = await response.json()

    if (data.success) {
      const imageUrl = data.data.url
      emit('update:modelValue', imageUrl)
      selectedFile.value = null
      uploadMethod.value = 'url'
      urlInput.value = imageUrl
    } else {
      throw new Error(data.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value =
      error.message || 'Greška pri učitavanju slike. Pokušajte ponovo ili koristite URL.'
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// URL methods
const handleUrlInput = () => {
  urlError.value = ''
  emit('update:modelValue', urlInput.value)
}

const validateUrl = async () => {
  if (!urlInput.value) return

  try {
    // Basic client-side validation first
    new URL(urlInput.value)

    // Backend validation
    const response = await fetch(
      `${IMAGE_CONFIG.BACKEND_BASE_URL}${IMAGE_CONFIG.VALIDATE_URL_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput.value }),
      },
    )

    const data = await response.json()

    if (!data.success) {
      urlError.value = data.message
    } else {
      urlError.value = ''
    }
  } catch {
    urlError.value = 'Unesite valjan URL'
  }
}

const handleImageLoad = () => {
  urlError.value = ''
}

const handleImageError = () => {
  if (urlInput.value) {
    urlError.value = 'Slika se ne može učitati s ovog URL-a'
  }
}

const removeImage = () => {
  urlInput.value = ''
  selectedFile.value = null
  emit('update:modelValue', '')
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.image-upload-container {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.upload-tabs {
  display: flex;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: #f8f9fa;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  background: #2a5298;
  color: white;
}

.upload-section {
  margin-top: 1rem;
}

.dropzone {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: #2a5298;
  background: #f0f7ff;
}

.dropzone.has-file {
  border-color: #28a745;
  background: #f8fff9;
}

.dropzone.uploading {
  border-color: #007bff;
  background: #f0f7ff;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.dropzone-content {
  padding: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: #2a5298;
  margin-bottom: 1rem;
}

.dropzone-content h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.dropzone-content p {
  color: #666;
  font-size: 0.9rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 2rem;
  color: #28a745;
}

.file-details {
  flex: 1;
  text-align: left;
}

.file-name {
  display: block;
  font-weight: 600;
  color: #333;
}

.file-size {
  display: block;
  color: #666;
  font-size: 0.9rem;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #c82333;
}

.uploading-state {
  padding: 1rem;
}

.upload-spinner {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

.upload-actions {
  margin-top: 1rem;
}

.upload-btn {
  background: #2a5298;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
}

.upload-btn:hover:not(:disabled) {
  background: #1e3c72;
}

.upload-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.url-section {
  margin-top: 1rem;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2a5298;
  box-shadow: 0 0 0 0.2rem rgba(42, 82, 152, 0.25);
}

.form-input.error {
  border-color: #dc3545;
}

.url-suggestions {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.suggestions-title {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.service-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.service-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #2a5298;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.service-link:hover {
  color: #1e3c72;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.preview-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-container img {
  max-width: 300px;
  max-height: 200px;
  width: auto;
  height: auto;
  display: block;
}

.remove-preview-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-preview-btn:hover {
  background: rgba(200, 35, 51, 0.9);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .dropzone {
    padding: 1rem;
  }

  .service-links {
    flex-direction: column;
  }

  .preview-container img {
    max-width: 100%;
  }
}
</style>
