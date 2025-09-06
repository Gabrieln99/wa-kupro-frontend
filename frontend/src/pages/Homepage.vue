<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <h2>Početna stranica</h2>
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
}
</style>
