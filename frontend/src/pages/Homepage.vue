<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <h2>Početna stranica</h2>
      <Card
        title="Proizvod 1"
        description="Opis proizvoda 1"
        price="10.00"
        image="https://via.placeholder.com/150"
        :biddingEnabled="true"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Card from '@/components/Card.vue'
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
