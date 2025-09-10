<template>
  <div class="login-container">
    <Card class="login-card">
      <template #header>
        <div class="text-center header-section">
          <div class="avatar-wrapper">
            <Avatar icon="pi pi-user" size="xlarge" class="mb-3" />
          </div>
          <h1 class="text-4xl font-bold m-0 header-title">Dobrodošli u KuPro</h1>
          <p class="header-subtitle mt-3">Molimo prijavite se na vaš račun i nastavite kupovinu</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="form-content">
          <Toast />

          <!-- Username -->
          <div class="form-row">
            <div class="input-group">
              <label for="username" class="input-label">
                <i class="pi pi-user label-icon"></i>
                Korisničko ime
              </label>
              <div class="input-wrapper">
                <InputText
                  id="username"
                  v-model="username"
                  class="styled-input"
                  :class="{ 'input-error': usernameError }"
                  placeholder="Unesite vaše korisničko ime"
                />
                <i class="pi pi-user input-icon"></i>
              </div>
              <small class="error-message">{{ usernameError }}</small>
            </div>
          </div>

          <!-- Password -->
          <div class="form-row">
            <div class="input-group">
              <label for="password" class="input-label">
                <i class="pi pi-lock label-icon"></i>
                Lozinka
              </label>
              <div class="input-wrapper">
                <Password
                  id="password"
                  v-model="password"
                  class="styled-password"
                  :class="{ 'input-error': passwordError }"
                  :feedback="false"
                  toggleMask
                  placeholder="Unesite vašu lozinku"
                />
                <i class="pi pi-lock input-icon password-icon"></i>
              </div>
              <small class="error-message">{{ passwordError }}</small>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="options-row">
            <div class="remember-section">
              <Checkbox v-model="rememberMe" binary class="remember-checkbox" />
              <label class="remember-label">Zapamti me</label>
            </div>
            <span class="forgot-link" @click="router.push('/forgot-password')">
              Zaboravili lozinku?
            </span>
          </div>

          <!-- Login Button -->
          <div class="button-wrapper">
            <Button
              type="submit"
              label="Prijavi se"
              icon="pi pi-sign-in"
              :loading="loading"
              class="login-btn"
              size="large"
            />

            <div class="divider-section">
              <Divider align="center">
                <span class="divider-text">Novi korisnik?</span>
              </Divider>
            </div>

            <Button
              type="button"
              label="Stvori račun"
              icon="pi pi-user-plus"
              severity="secondary"
              outlined
              class="register-link-btn"
              @click="router.push('/register')"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const loading = ref(false)
const rememberMe = ref(false)
const usernameError = ref('')
const passwordError = ref('')

const validateForm = () => {
  let isValid = true
  usernameError.value = ''
  passwordError.value = ''

  if (!username.value.trim()) {
    usernameError.value = 'Korisničko ime je obavezno'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Lozinka je obavezna'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    console.log('🔐 LoginForm: Starting login process...')
    await authStore.login({
      username: username.value.trim(),
      password: password.value,
    })

    console.log('✅ LoginForm: Login successful!')
    console.log('👤 Current logged in user:', authStore.user)
    console.log('🎭 User role:', authStore.role)

    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', username.value)
    }

    toast.add({
      severity: 'success',
      summary: 'Uspjeh',
      detail: 'Uspješno ste se prijavili',
      life: 3000,
    })

    // Redirect based on user role
    if (authStore.isAdmin) {
      console.log('🚀 Redirecting admin to /admin')
      router.push('/admin')
    } else {
      console.log('🚀 Redirecting user to /user-profile')
      router.push('/user-profile')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Greška',
      detail: error.message || 'Neispravni podaci za prijavu',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
}

.login-card {
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: white;
}

.header-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.avatar-wrapper {
  position: relative;
  z-index: 2;
}

.header-title {
  position: relative;
  z-index: 2;
  color: white;
}

.header-subtitle {
  position: relative;
  z-index: 2;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 1.1rem;
}

.form-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  margin-bottom: 0.5rem;
}

.input-group {
  position: relative;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.label-icon {
  color: #3b82f6;
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.styled-input {
  width: 100% !important;
  padding: 0.875rem 1rem 0.875rem 3rem !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: #fafafa !important;
}

.styled-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  background: white !important;
  transform: translateY(-1px);
}

.styled-input:hover {
  border-color: #9ca3af !important;
  background: white !important;
}

.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  font-size: 1.1rem;
  z-index: 1;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #3b82f6;
}

.styled-password {
  width: 100% !important;
}

.styled-password :deep(.p-password-input) {
  width: 100% !important;
  padding: 0.875rem 1rem 0.875rem 3rem !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: #fafafa !important;
}

.styled-password :deep(.p-password-input:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  background: white !important;
  transform: translateY(-1px);
}

.password-icon {
  pointer-events: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
  min-height: 1.25rem;
}

.options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.remember-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-checkbox {
  border-radius: 0.375rem;
}

.remember-label {
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.forgot-link {
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.button-wrapper {
  margin-top: 1.5rem;
}

.login-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
}

.register-link-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid #3b82f6;
  transition: all 0.3s ease;
}

.register-link-btn:hover {
  background: #f0f9ff;
  transform: translateY(-1px);
}

.divider-section {
  margin: 1.5rem 0;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #64748b;
  font-weight: 500;
}

:deep(.p-card-header) {
  padding: 0;
}

:deep(.p-card-content) {
  padding: 0;
}

:deep(.p-avatar) {
  width: 4rem;
  height: 4rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  position: relative;
  z-index: 2;
}

:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  border: 2px solid #d1d5db;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* Responsive design */
@media (max-width: 640px) {
  .login-container {
    padding: 0;
  }

  .login-card {
    max-width: 100%;
    margin: 0 10px;
  }

  .header-section {
    padding: 2rem 1rem;
  }

  .form-content {
    padding: 1.5rem;
  }

  .options-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

/* Dark mode overrides - highest specificity */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: #1f2937 !important;
    border-color: #374151 !important;
  }

  .form-content {
    background: #1f2937 !important;
  }

  .input-label {
    color: #f9fafb !important;
  }

  .styled-input,
  .styled-password :deep(.p-password-input) {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .styled-input:hover,
  .styled-password :deep(.p-password-input):hover {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .styled-input:focus,
  .styled-password :deep(.p-password-input):focus {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #3b82f6 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .input-error {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #ef4444 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .remember-label {
    color: #f9fafb !important;
  }

  .input-icon {
    color: #9ca3af !important;
  }
}
</style>
