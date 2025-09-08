<template>
  <div class="admin-tabs">
    <button
      class="tab-button"
      :class="{ active: activeTab === 'products' }"
      @click="$emit('update:activeTab', 'products')"
    >
      <i class="pi pi-box"></i>
      Upravljanje proizvodima
    </button>
    <button
      class="tab-button"
      :class="{ active: activeTab === 'add-product' }"
      @click="$emit('update:activeTab', 'add-product')"
    >
      <i class="pi pi-plus"></i>
      Dodaj proizvod
    </button>
    <button
      class="tab-button"
      :class="{ active: activeTab === 'users' }"
      @click="$emit('update:activeTab', 'users')"
    >
      <i class="pi pi-users"></i>
      Korisnici
    </button>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true,
  },
})

defineEmits(['update:activeTab'])
</script>

<style scoped>
.admin-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: transparent;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
  background: white;
  color: #2a5298;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-tabs {
    flex-direction: column;
  }
}
</style>
