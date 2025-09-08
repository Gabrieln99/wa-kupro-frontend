<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="cart-container">
        <h2>Vaša košarica</h2>
        <div class="empty-cart">
          <i class="pi pi-shopping-cart"></i>
          <h3>Košarica je prazna</h3>
          <p>Dodajte proizvode u košaricu da biste počeli s kupovinom</p>
          <button class="shop-button" @click="$router.push('/products')">
            <i class="pi pi-shopping-bag"></i>
            Idite na kupovinu
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  background: #f8f9fa;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-container h2 {
  text-align: center;
  color: #2a5298;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 700;
}

.empty-cart {
  background: white;
  border-radius: 15px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-cart i {
  font-size: 4rem;
  color: #2a5298;
  margin-bottom: 20px;
}

.empty-cart h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.shop-button {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.shop-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(42, 82, 152, 0.3);
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 10px;
  }

  .cart-container h2 {
    font-size: 2rem;
  }

  .empty-cart {
    padding: 40px 20px;
  }

  .empty-cart i {
    font-size: 3rem;
  }

  .empty-cart h3 {
    font-size: 1.5rem;
  }
}
</style>
