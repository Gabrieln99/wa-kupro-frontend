<template>
  <div class="page-content">
    <Navbar />
    <div class="main-content">
      <h2>Proizvodi</h2>
      <div class="products-grid">
        <Card
          title="Product 1"
          description="Opis proizvoda 1"
          price="10.00"
          image="https://via.placeholder.com/150"
          :biddingEnabled="true"
        />
        <Card
          title="Product 2"
          description="Opis proizvoda 2"
          price="10.00"
          image="https://via.placeholder.com/150"
          :biddingEnabled="false"
        />
        <Card
          title="Product 3"
          description="Opis proizvoda 3"
          price="10.00"
          image="https://via.placeholder.com/150"
          :biddingEnabled="false"
        />
        <Card
          title="Product 4"
          description="Opis proizvoda 4"
          price="10.00"
          image="https://via.placeholder.com/150"
          :biddingEnabled="true"
        />
        <Card
          title="Product 5"
          description="Opis proizvoda 5"
          price="10.00"
          image="https://via.placeholder.com/150"
          :biddingEnabled="true"
        />
      </div>
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
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
</style>
