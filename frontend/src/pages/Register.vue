<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <RegisterForm />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import RegisterForm from '@/components/RegisterForm.vue'
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
