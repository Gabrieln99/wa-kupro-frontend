<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <div class="flex justify-content-center align-items-center">
        <div class="w-full md:w-6 lg:w-4">
          <LoginForm />
        </div>
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
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
}
</style>
