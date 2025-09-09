<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

const authStore = useAuthStore()
const router = useRouter()

// Mobile menu state
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

function navigateAndClose(path) {
  router.push(path)
  closeMobileMenu()
}

function handleMobileLogout() {
  console.log('🚪 Navbar: Mobile logout triggered')
  console.log('👤 Current user before logout:', authStore.user)
  authStore.logout()
  router.push('/')
  closeMobileMenu()
}

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
    }
  },
  { immediate: true },
)

// Watch for route changes and close mobile menu
watch(
  () => router.currentRoute.value.path,
  () => {
    closeMobileMenu()
  },
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
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Svi proizvodi',
          icon: 'pi pi-list',
          command: () => router.push('/products'),
        },
        {
          label: 'Aktivne licitacije',
          icon: 'pi pi-clock',
          command: () => router.push('/products?bidding=active'),
        },
        { separator: true },
        {
          label: 'Kategorije',
          icon: 'pi pi-tags',
          items: [
            {
              label: 'Elektronika',
              command: () => router.push('/products?category=Elektronika'),
            },
            {
              label: 'Namještaj',
              command: () => router.push('/products?category=Namještaj'),
            },
            {
              label: 'Odjeća',
              command: () => router.push('/products?category=Odjeća'),
            },
            {
              label: 'Knjige',
              command: () => router.push('/products?category=Knjige'),
            },
            {
              label: 'Sport',
              command: () => router.push('/products?category=Sport'),
            },
            {
              label: 'Igračke',
              command: () => router.push('/products?category=Igračke'),
            },
            {
              label: 'Antikviteti',
              command: () => router.push('/products?category=Antikviteti'),
            },
            {
              label: 'Satovi',
              command: () => router.push('/products?category=Satovi'),
            },
            {
              label: 'Računala',
              command: () => router.push('/products?category=Računala'),
            },
            {
              label: 'Glazbala',
              command: () => router.push('/products?category=Glazbala'),
            },
            {
              label: 'Ostalo',
              command: () => router.push('/products?category=Ostalo'),
            },
          ],
        },
      ],
    },
  ]

  // No additional menu items for authenticated users - they use the user button instead
  return base
})

function handleLogout() {
  console.log('🚪 Navbar: Logout triggered')
  console.log('👤 Current user before logout:', authStore.user)
  authStore.logout()
  router.push('/')
}

// Cleanup function to restore body scroll on component unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="navbar-container">
    <!-- Desktop Navigation -->
    <Menubar :model="items" class="custom-menubar desktop-nav">
      <template #start>
        <div class="logo" @click="router.push('/')">
          <span>KuPro</span>
        </div>
      </template>
      <template #end>
        <div class="auth-buttons">
          <!-- Cart button for all users -->
          <Button
            icon="pi pi-shopping-cart"
            class="p-button-text p-button-rounded cart-btn"
            aria-label="Košarica"
            @click="router.push('/cart')"
          />

          <!-- Authentication buttons for non-authenticated users -->
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

          <!-- User info and logout for authenticated users -->
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
        </div>
      </template>
    </Menubar>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav">
      <div class="mobile-header">
        <div class="logo" @click="router.push('/')">
          <span>KuPro</span>
        </div>
        <div class="mobile-actions">
          <!-- Cart button for mobile -->
          <Button
            icon="pi pi-shopping-cart"
            class="p-button-text p-button-rounded cart-btn"
            aria-label="Košarica"
            @click="router.push('/cart')"
          />
          <!-- Hamburger menu button -->
          <Button
            :icon="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
            class="p-button-text p-button-rounded hamburger-btn"
            aria-label="Menu"
            @click="toggleMobileMenu"
          />
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mobile-menu" @click.stop>
          <!-- Navigation Items -->
          <div class="mobile-menu-section">
            <h3>Navigacija</h3>
            <div class="mobile-menu-item" @click="navigateAndClose('/')">
              <i class="pi pi-home"></i>
              <span>Naslovna</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products')">
              <i class="pi pi-th-large"></i>
              <span>Svi proizvodi</span>
            </div>
          </div>

          <!-- Categories -->
          <div class="mobile-menu-section">
            <h3>Kategorije</h3>
            <div
              class="mobile-menu-item"
              @click="navigateAndClose('/products?category=Elektronika')"
            >
              <i class="pi pi-mobile"></i>
              <span>Elektronika</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Namještaj')">
              <i class="pi pi-home"></i>
              <span>Namještaj</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Odjeća')">
              <i class="pi pi-star"></i>
              <span>Odjeća</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Igračke')">
              <i class="pi pi-star"></i>
              <span>Igračke</span>
            </div>
            <div
              class="mobile-menu-item"
              @click="navigateAndClose('/products?category=Automobili')"
            >
              <i class="pi pi-car"></i>
              <span>Automobili</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Računala')">
              <i class="pi pi-desktop"></i>
              <span>Računala</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Glazbala')">
              <i class="pi pi-volume-up"></i>
              <span>Glazbala</span>
            </div>
            <div class="mobile-menu-item" @click="navigateAndClose('/products?category=Ostalo')">
              <i class="pi pi-ellipsis-h"></i>
              <span>Ostalo</span>
            </div>
          </div>

          <!-- Authentication -->
          <div class="mobile-menu-section">
            <h3>Račun</h3>
            <div
              v-if="!authStore.isAuthenticated"
              class="mobile-menu-item"
              @click="navigateAndClose('/register')"
            >
              <i class="pi pi-user-plus"></i>
              <span>Registracija</span>
            </div>
            <div
              v-if="!authStore.isAuthenticated"
              class="mobile-menu-item"
              @click="navigateAndClose('/login')"
            >
              <i class="pi pi-sign-in"></i>
              <span>Prijava</span>
            </div>
            <div
              v-if="authStore.isAuthenticated"
              class="mobile-menu-item"
              @click="navigateAndClose(authStore.isAdmin ? '/admin' : '/user-profile')"
            >
              <i class="pi pi-user"></i>
              <span>{{
                authStore.user?.name && authStore.user?.surname
                  ? `${authStore.user.name} ${authStore.user.surname}`
                  : authStore.user?.username || 'Korisnik'
              }}</span>
            </div>
            <div
              v-if="authStore.isAuthenticated"
              class="mobile-menu-item"
              @click="handleMobileLogout"
            >
              <i class="pi pi-sign-out"></i>
              <span>Odjava</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Navbar Container */
.navbar-container {
  position: relative;
  width: 100%;
}

/* Desktop Navigation - default visible */
.desktop-nav {
  display: block;
}

/* Mobile Navigation - hidden by default */
.mobile-nav {
  display: none;
}

/* Media query for mobile responsiveness */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}

/* Desktop Styles */
.custom-menubar,
.p-menubar {
  background: var(--app-surface-color, #fff);
  border-radius: 0;
  box-shadow: 0 2px 8px var(--app-shadow, rgba(33, 150, 243, 0.08));
  border: none;
  padding-right: 2rem;
  color: var(--app-text-color, #1976d2);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
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
  cursor: pointer;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #1565c0;
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
  background: var(--app-surface-color, #fff) !important;
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
  background: var(--app-surface-color, #fff) !important;
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

/* Mobile Navigation Styles */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--app-surface-color, #fff);
  box-shadow: 0 2px 8px var(--app-shadow, rgba(33, 150, 243, 0.08));
  position: relative;
  z-index: 1000;
}

.mobile-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.hamburger-btn {
  color: #1976d2 !important;
  background: transparent !important;
  border: 1px solid #1976d2 !important;
  border-radius: 6px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.hamburger-btn:hover,
.hamburger-btn:focus {
  background: #1976d2 !important;
  color: #fff !important;
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(2px);
}

.mobile-menu {
  background: var(--app-surface-color, #fff);
  width: 280px;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem 0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.mobile-menu-section {
  padding: 0 1.5rem;
  margin-bottom: 2rem;
}

.mobile-menu-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--app-text-color, #333);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--app-border-color, #e0e0e0);
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--app-text-color, #333);
}

.mobile-menu-item:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.mobile-menu-item i {
  font-size: 1.1rem;
  width: 1.2rem;
  text-align: center;
  color: #1976d2;
}

.mobile-menu-item span {
  font-size: 1rem;
  font-weight: 500;
}

/* Mobile-specific cart button styling */
@media (max-width: 768px) {
  .mobile-actions .cart-btn {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.2rem;
  }

  .mobile-header .logo {
    font-size: 1.5rem;
    padding-right: 0;
  }
}

/* Smooth transitions for menu */
.mobile-menu-overlay {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
