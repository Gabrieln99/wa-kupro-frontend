<template>
  <div class="login-container">
    <Card class="login-card">
      <template #header>
        <div class="text-center">
          <Avatar icon="pi pi-user" size="xlarge" class="mb-3" />
          <h1 class="text-3xl font-bold m-0">Welcome Back</h1>
          <p class="text-600 mt-2">Please sign in to your account</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="flex flex-column gap-3">
        <Toast />

        <div class="field">
          <label for="username" class="block mb-2">Username</label>
          <span class="p-input-icon-left w-full">
            <i class="pi pi-user" />
            <InputText
              id="username"
              v-model="username"
              class="w-full"
              :class="{ 'p-invalid': usernameError }"
              placeholder="Enter your username"
            />
          </span>
          <small class="p-error block">{{ usernameError }}</small>
        </div>

        <div class="field">
          <label for="password" class="block mb-2">Password</label>
          <span class="p-input-icon-left w-full">
            <i class="pi pi-lock" />
            <Password
              id="password"
              v-model="password"
              class="w-full"
              :class="{ 'p-invalid': passwordError }"
              :feedback="false"
              toggleMask
              placeholder="Enter your password"
            />
          </span>
          <small class="p-error block">{{ passwordError }}</small>
        </div>

        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center">
            <Checkbox v-model="rememberMe" binary class="mr-2" />
            <label>Remember me</label>
          </div>
          <Button
            link
            type="button"
            label="Forgot Password?"
            @click="router.push('/forgot-password')"
          />
        </div>

        <Button
          type="submit"
          label="Sign In"
          icon="pi pi-sign-in"
          :loading="loading"
          class="mt-2"
        />

        <Divider align="center">
          <span class="text-600 font-medium">New here?</span>
        </Divider>

        <Button
          type="button"
          label="Create Account"
          icon="pi pi-user-plus"
          severity="secondary"
          outlined
          @click="router.push('/register')"
        />
      </form>
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
    usernameError.value = 'Username is required'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    await authStore.login({
      username: username.value.trim(),
      password: password.value,
    })

    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', username.value)
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged in successfully',
      life: 3000,
    })

    router.push('/dashboard')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Invalid credentials',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
}

.login-card {
  width: 100%;
  max-width: 450px;
  margin: 2rem;
}

:deep(.p-password),
:deep(.p-password input),
:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-card-header) {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

:deep(.p-card-content) {
  padding-top: 0;
}

:deep(.p-avatar) {
  width: 5rem;
  height: 5rem;
  background: var(--primary-color);
  color: var(--primary-color-text);
}
</style>
