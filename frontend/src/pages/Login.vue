<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="login-wrapper">
        <LoginForm />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
.page-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: calc(100vh - 120px); /* Account for navbar and footer */
}

.login-wrapper {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .main-content {
    min-height: calc(100vh - 100px);
    padding: 10px;
  }

  .login-wrapper {
    max-width: 95%;
    padding: 10px;
  }
}
</style>
