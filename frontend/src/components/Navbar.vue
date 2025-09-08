<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

const authStore = useAuthStore()
const router = useRouter()

// Watch for auth changes and log current user
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (newUser !== oldUser) {
      console.log('👤 Navbar: Auth state changed')
      console.log('Previous user:', oldUser)
      console.log('Current user:', newUser)
      console.log('Is authenticated:', authStore.isAuthenticated)
      console.log('User role:', authStore.role)
      console.log('Has token:', !!authStore.token)

      // Check for inconsistent state
      if (authStore.token && (!authStore.user || !authStore.role)) {
        console.log('⚠️ Inconsistent auth state detected in Navbar!')
        console.log('Token exists but missing user/role data - clearing auth state')
        authStore.clearAuthState()
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  console.log('🧭 Navbar mounted - Current session:')
  console.log('👤 Current user:', authStore.user)
  console.log('🔐 Is authenticated:', authStore.isAuthenticated)
  console.log('🎭 User role:', authStore.role)
})

const items = computed(() => {
  const base = [
    {
      label: 'Početna',
      icon: 'pi pi-home',
      command: () => router.push('/'),
    },
    {
      label: 'Proizvodi',
      icon: 'pi pi-shopping-cart',
      command: () => router.push('/products'),
    },
  ]
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      base.push({
        label: 'Admin',
        icon: 'pi pi-cog',
        command: () => router.push('/admin'),
      })
    } else {
      base.push({
        label: 'Profil korisnika',
        icon: 'pi pi-user',
        command: () => router.push('/user-profile'),
      })
    }
    base.push({
      label: 'Košarica',
      icon: 'pi pi-shopping-cart',
      command: () => router.push('/cart'),
    })
  }
  return base
})

function handleLogout() {
  console.log('🚪 Navbar: Logout triggered')
  console.log('👤 Current user before logout:', authStore.user)
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <Menubar :model="items" class="custom-menubar">
    <template #start>
      <div class="logo">
        <span>kupro</span>
      </div>
    </template>
    <template #end>
      <div class="auth-buttons">
        <Button
          v-if="!authStore.isAuthenticated"
          label="Registracija"
          icon="pi pi-user-plus"
          class="p-button-text p-button-rounded blue-btn"
          @click="router.push('/register')"
        />
        <Button
          v-if="!authStore.isAuthenticated"
          label="Prijava"
          icon="pi pi-sign-in"
          class="p-button-text p-button-rounded blue-btn"
          @click="router.push('/login')"
        />
        <Button
          v-if="authStore.isAuthenticated"
          :label="
            authStore.user?.name && authStore.user?.surname
              ? `${authStore.user.name} ${authStore.user.surname}`
              : authStore.user?.username || 'Korisnik'
          "
          icon="pi pi-user"
          class="p-button-text p-button-rounded blue-btn"
          @click="router.push(authStore.isAdmin ? '/admin' : '/user-profile')"
        />
        <Button
          v-if="authStore.isAuthenticated"
          label="Odjava"
          icon="pi pi-sign-out"
          class="p-button-text p-button-rounded blue-btn"
          @click="handleLogout"
        />
        <Button
          icon="pi pi-shopping-cart"
          class="p-button-text p-button-rounded cart-btn"
          aria-label="Cart"
          @click="router.push('/cart')"
        />
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
.custom-menubar,
.p-menubar {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  border: none;
  padding-right: 2rem;
  color: #1976d2;
}

.logo {
  font-size: 1.7rem;
  font-weight: bold;
  color: #1976d2;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  padding-right: 2rem;
  font-family: 'Segoe UI', Arial, sans-serif;
  user-select: none;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
  align-items: center;
}

.blue-btn {
  color: #1976d2 !important;
  border: 1px solid #1976d2 !important;
  background: #fff !important;
  transition:
    background 0.2s,
    color 0.2s;
}
.blue-btn:hover,
.blue-btn:focus {
  background: #1976d2 !important;
  color: #fff !important;
  border: 1px solid #1976d2 !important;
}

.cart-btn {
  font-size: 1.5rem;
  color: #1976d2 !important;
  background: #fff !important;
  border: 1px solid #1976d2 !important;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;
}
.cart-btn:hover,
.cart-btn:focus {
  background: #1976d2 !important;
  color: #fff !important;
}

.p-menubar .p-menuitem-link {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1976d2 !important;
  background: transparent !important;
  border-radius: 6px;
  transition:
    background 0.2s,
    color 0.2s;
}
.p-menubar .p-menuitem-link:hover,
.p-menubar .p-menuitem-link:focus {
  background: #e3f2fd !important;
  color: #1976d2 !important;
}
.p-menubar .p-menuitem-link .pi {
  margin-right: 0.5rem;
  color: #1976d2 !important;
}
</style>
