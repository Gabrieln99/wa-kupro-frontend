<template>
  <Card class="register-card">
    <template #header>
      <div class="text-center header-section">
        <div class="avatar-wrapper">
          <Avatar icon="pi pi-user-plus" size="xlarge" class="mb-3" />
        </div>
        <h1 class="text-4xl font-bold m-0 header-title">Stvori račun</h1>
        <p class="text-600 mt-3 header-subtitle">
          Pridruži se KuPro zajednici i počni svoju kupovnu avanturu
        </p>
      </div>
    </template>

    <template #content>
      <form @submit.prevent="handleRegister" class="form-content">
        <Toast />

        <div class="form-row">
          <div class="grid">
            <!-- Name -->
            <div class="col-12 md:col-6">
              <div class="input-group">
                <label for="name" class="input-label">
                  <i class="pi pi-user label-icon"></i>
                  Ime
                </label>
                <div class="input-wrapper">
                  <InputText
                    id="name"
                    v-model="formData.name"
                    class="styled-input"
                    :class="{ 'input-error': errors.name }"
                    placeholder="Unesite vaše ime"
                  />
                  <i class="pi pi-user input-icon"></i>
                </div>
                <small class="error-message">{{ errors.name }}</small>
              </div>
            </div>

            <!-- Surname -->
            <div class="col-12 md:col-6">
              <div class="input-group">
                <label for="surname" class="input-label">
                  <i class="pi pi-user label-icon"></i>
                  Prezime
                </label>
                <div class="input-wrapper">
                  <InputText
                    id="surname"
                    v-model="formData.surname"
                    class="styled-input"
                    :class="{ 'input-error': errors.surname }"
                    placeholder="Unesite vaše prezime"
                  />
                  <i class="pi pi-user input-icon"></i>
                </div>
                <small class="error-message">{{ errors.surname }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Email -->
        <div class="form-row">
          <div class="input-group">
            <label for="email" class="input-label">
              <i class="pi pi-envelope label-icon"></i>
              Email adresa
            </label>
            <div class="input-wrapper">
              <InputText
                id="email"
                v-model="formData.email"
                type="email"
                class="styled-input"
                :class="{ 'input-error': errors.email }"
                placeholder="ime@primjer.com"
              />
              <i class="pi pi-envelope input-icon"></i>
            </div>
            <small class="error-message">{{ errors.email }}</small>
          </div>
        </div>

        <!-- Username -->
        <div class="form-row">
          <div class="input-group">
            <label for="username" class="input-label">
              <i class="pi pi-at label-icon"></i>
              Korisničko ime
            </label>
            <div class="input-wrapper">
              <InputText
                id="username"
                v-model="formData.username"
                class="styled-input"
                :class="{ 'input-error': errors.username }"
                placeholder="Odaberite jedinstveno korisničko ime"
              />
              <i class="pi pi-at input-icon"></i>
            </div>
            <small class="error-message">{{ errors.username }}</small>
          </div>
        </div>

        <!-- OIB -->
        <div class="form-row">
          <div class="input-group">
            <label for="oib" class="input-label">
              <i class="pi pi-id-card label-icon"></i>
              OIB (11 znamenki)
            </label>
            <div class="input-wrapper">
              <InputText
                id="oib"
                v-model="formData.oib"
                class="styled-input"
                :class="{ 'input-error': errors.oib }"
                placeholder="12345678901"
                maxlength="11"
              />
              <i class="pi pi-id-card input-icon"></i>
            </div>
            <small class="error-message">{{ errors.oib }}</small>
          </div>
        </div>

        <!-- Address -->
        <div class="form-row">
          <div class="input-group">
            <label for="address" class="input-label">
              <i class="pi pi-home label-icon"></i>
              Adresa
            </label>
            <div class="input-wrapper">
              <InputText
                id="address"
                v-model="formData.address"
                class="styled-input"
                :class="{ 'input-error': errors.address }"
                placeholder="Ulica i broj, grad, poštanski broj"
              />
              <i class="pi pi-home input-icon"></i>
            </div>
            <small class="error-message">{{ errors.address }}</small>
          </div>
        </div>

        <!-- Card Information -->
        <div class="card-section">
          <h3 class="section-header">
            <i class="pi pi-credit-card section-header-icon"></i>
            Podaci o plaćanju
          </h3>
          <div class="grid">
            <!-- Card Number -->
            <div class="col-12">
              <div class="input-group">
                <label for="cardNumber" class="input-label">
                  <i class="pi pi-credit-card label-icon"></i>
                  Broj kartice
                </label>
                <div class="input-wrapper">
                  <InputText
                    id="cardNumber"
                    v-model="formData.cardInfo.cardNumber"
                    class="styled-input"
                    :class="{ 'input-error': errors.cardNumber }"
                    placeholder="1234 5678 9012 3456"
                    maxlength="16"
                  />
                  <i class="pi pi-credit-card input-icon"></i>
                </div>
                <small class="error-message">{{ errors.cardNumber }}</small>
              </div>
            </div>

            <!-- Expiry Date -->
            <div class="col-12">
              <div class="input-group">
                <label for="expiryDate" class="input-label">
                  <i class="pi pi-calendar label-icon"></i>
                  Datum isteka
                </label>
                <div class="input-wrapper">
                  <InputText
                    id="expiryDate"
                    v-model="formData.cardInfo.expiryDate"
                    class="styled-input"
                    :class="{ 'input-error': errors.expiryDate }"
                    placeholder="MM/GG"
                    maxlength="5"
                  />
                  <i class="pi pi-calendar input-icon"></i>
                </div>
                <small class="error-message">{{ errors.expiryDate }}</small>
              </div>
            </div>
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
                v-model="formData.password"
                class="styled-password"
                :class="{ 'input-error': errors.password }"
                placeholder="Unesite sigurnu lozinku"
                toggleMask
                :promptLabel="'Unesite lozinku'"
                :weakLabel="'Slaba'"
                :mediumLabel="'Srednja'"
                :strongLabel="'Jaka'"
              />
              <i class="pi pi-lock input-icon password-icon"></i>
            </div>
            <small class="error-message">{{ errors.password }}</small>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-row">
          <div class="input-group">
            <label for="confirmPassword" class="input-label">
              <i class="pi pi-shield label-icon"></i>
              Potvrdi lozinku
            </label>
            <div class="input-wrapper">
              <Password
                id="confirmPassword"
                v-model="confirmPassword"
                class="styled-password"
                :class="{ 'input-error': errors.confirmPassword }"
                placeholder="Potvrdite vašu lozinku"
                :feedback="false"
                toggleMask
              />
              <i class="pi pi-shield input-icon password-icon"></i>
            </div>
            <small class="error-message">{{ errors.confirmPassword }}</small>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms-wrapper">
          <div class="flex align-items-start gap-3">
            <Checkbox v-model="agreeToTerms" binary class="terms-checkbox" />
            <div class="terms-text">
              <label class="cursor-pointer">
                Slažem se s <a href="#" class="text-primary terms-link">uvjetima korištenja</a> i
                <a href="#" class="text-primary terms-link">politikom privatnosti</a>
              </label>
              <small v-if="errors.terms" class="error-message">{{ errors.terms }}</small>
            </div>
          </div>
        </div>

        <!-- Register Button -->
        <div class="button-wrapper">
          <Button
            type="submit"
            label="Stvori moj račun"
            icon="pi pi-user-plus"
            :loading="loading"
            class="register-btn"
            size="large"
          />

          <div class="divider-section">
            <Divider align="center">
              <span class="divider-text">Već imate račun?</span>
            </Divider>
          </div>

          <Button
            type="button"
            label="Prijavite se ovdje"
            icon="pi pi-sign-in"
            severity="secondary"
            outlined
            class="login-link-btn"
            @click="router.push('/login')"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { userService } from '@/services/api'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import Fieldset from 'primevue/fieldset'

const router = useRouter()
const toast = useToast()

const formData = reactive({
  name: '',
  surname: '',
  email: '',
  username: '',
  oib: '',
  address: '',
  cardInfo: {
    cardNumber: '',
    expiryDate: '',
  },
  password: '',
})

const confirmPassword = ref('')
const agreeToTerms = ref(false)
const loading = ref(false)

const errors = reactive({
  name: '',
  surname: '',
  email: '',
  username: '',
  oib: '',
  address: '',
  cardNumber: '',
  expiryDate: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  let isValid = true

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Ime je obavezno'
    isValid = false
  }

  // Surname validation
  if (!formData.surname.trim()) {
    errors.surname = 'Prezime je obavezno'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'Email je obavezan'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Molimo unesite valjani email'
    isValid = false
  }

  // Username validation
  if (!formData.username.trim()) {
    errors.username = 'Korisničko ime je obavezno'
    isValid = false
  }

  // OIB validation
  if (!formData.oib) {
    errors.oib = 'OIB je obavezan'
    isValid = false
  } else if (!/^\d{11}$/.test(formData.oib)) {
    errors.oib = 'OIB mora imati točno 11 znamenki'
    isValid = false
  }

  // Address validation
  if (!formData.address.trim()) {
    errors.address = 'Adresa je obavezna'
    isValid = false
  }

  // Card number validation
  if (!formData.cardInfo.cardNumber) {
    errors.cardNumber = 'Broj kartice je obavezan'
    isValid = false
  } else if (!/^\d{16}$/.test(formData.cardInfo.cardNumber)) {
    errors.cardNumber = 'Broj kartice mora imati 16 znamenki'
    isValid = false
  }

  // Expiry date validation
  if (!formData.cardInfo.expiryDate) {
    errors.expiryDate = 'Datum isteka je obavezan'
    isValid = false
  } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.cardInfo.expiryDate)) {
    errors.expiryDate = 'Datum isteka mora biti u MM/GG formatu'
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Lozinka je obavezna'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Lozinka mora imati najmanje 6 znakova'
    isValid = false
  }

  // Confirm password validation
  if (!confirmPassword.value) {
    errors.confirmPassword = 'Molimo potvrdite vašu lozinku'
    isValid = false
  } else if (formData.password !== confirmPassword.value) {
    errors.confirmPassword = 'Lozinke se ne poklapaju'
    isValid = false
  }

  // Terms validation
  if (!agreeToTerms.value) {
    errors.terms = 'Morate se složiti s uvjetima i odredbama'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    console.log('📋 Registration form data being sent:', formData)

    await userService.register(formData)

    toast.add({
      severity: 'success',
      summary: 'Uspjeh',
      detail: 'Račun je uspješno stvoren! Molimo prijavite se.',
      life: 5000,
    })

    router.push('/login')
  } catch (error) {
    console.error('❌ Registration error:', error)
    console.error('❌ Error response:', error.response?.data)

    toast.add({
      severity: 'error',
      summary: 'Greška',
      detail: error.response?.data?.message || error.message || 'Registracija neuspješna',
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.header-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
  padding: 2rem;
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

.card-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  margin: 1rem 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.section-header-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.terms-wrapper {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin: 1rem 0;
}

.terms-checkbox {
  margin-top: 0.25rem;
}

.terms-text {
  flex: 1;
}

.terms-link {
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.button-wrapper {
  margin-top: 1.5rem;
}

.register-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: linear-gradient(135deg, #1a365d 0%, #2a5298 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(42, 82, 152, 0.4);
}

.login-link-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid #2a5298;
  transition: all 0.3s ease;
}

.login-link-btn:hover {
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
  background: #2a5298;
  border-color: #2a5298;
}

:deep(.p-password .p-password-meter) {
  background: #e5e7eb;
  border-radius: 0.25rem;
}

:deep(.p-password .p-password-strength) {
  border-radius: 0.25rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .register-card {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .header-section {
    padding: 2rem 1rem;
  }

  .form-content {
    padding: 1.5rem;
  }

  .card-section {
    padding: 1rem;
  }
}

/* Dark mode overrides - highest specificity */
@media (prefers-color-scheme: dark) {
  .register-card {
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
  .styled-password :deep(.p-password-input),
  .styled-textarea {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-color: #374151 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .styled-input:hover,
  .styled-password :deep(.p-password-input):hover,
  .styled-textarea:hover {
    background: #374151 !important;
    color: #f9fafb !important;
    border-color: #4b5563 !important;
    -webkit-text-fill-color: #f9fafb !important;
  }

  .styled-input:focus,
  .styled-password :deep(.p-password-input):focus,
  .styled-textarea:focus {
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

  .remember-label,
  .terms-label {
    color: #f9fafb !important;
  }

  .input-icon {
    color: #9ca3af !important;
  }

  .card-section {
    background: #1f2937 !important;
  }

  .success-message {
    color: #34d399 !important;
  }
}
</style>
