<template>
  <div class="users-section">
    <div class="section-header">
      <h3>Registrirani korisnici</h3>
      <span class="user-count">{{ users.length }} korisnika</span>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <span>Učitavanje korisnika...</span>
    </div>

    <div v-else-if="users.length > 0" class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Datum registracije</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="user-row">
            <td class="user-name">
              <i class="pi pi-user user-icon"></i>
              {{ user.name }}
            </td>
            <td class="user-email">{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ user.role === 'admin' ? 'Administrator' : 'Korisnik' }}
              </span>
            </td>
            <td class="user-date">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="user-actions">
              <Button
                v-if="user.role !== 'admin'"
                label="Promijeni u admin"
                icon="pi pi-crown"
                class="p-button-sm p-button-success"
                @click="$emit('promote-user', user._id, user.name)"
              />
              <Button
                v-if="user.role === 'admin' && user._id !== currentUserId"
                label="Ukloni admin"
                icon="pi pi-user-minus"
                class="p-button-sm p-button-warning"
                @click="$emit('demote-user', user._id, user.name)"
              />
              <Button
                v-if="user._id !== currentUserId"
                icon="pi pi-trash"
                class="p-button-sm p-button-danger p-button-outlined"
                title="Obriši korisnika"
                @click="$emit('delete-user', user._id, user.name)"
              />
              <span v-if="user._id === currentUserId" class="current-user-label"> (Vi) </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="no-users">
      <i class="pi pi-users no-users-icon"></i>
      <h3>Nema registriranih korisnika</h3>
      <p>Trenutno nema korisnika u sustavu.</p>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

defineProps({
  users: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentUserId: {
    type: String,
    default: null,
  },
})

defineEmits(['promote-user', 'demote-user', 'delete-user'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.user-count {
  background: #e8f5e8;
  color: #2e7d2e;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 15px;
}

.loading-icon {
  font-size: 2rem;
  color: #2a5298;
}

.users-table-container {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.users-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 15px 20px;
  text-align: left;
  border-bottom: 2px solid #e1e5e9;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.user-icon {
  color: #2a5298;
  font-size: 1.1rem;
}

.user-email {
  color: #666;
  font-family: monospace;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.admin {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.user-date {
  color: #666;
  font-size: 0.9rem;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.current-user-label {
  color: #2a5298;
  font-style: italic;
  font-size: 0.9rem;
  font-weight: 600;
}

.no-users {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-users-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .users-table-container {
    overflow-x: scroll;
  }

  .users-table th,
  .users-table td {
    padding: 10px 8px;
    font-size: 0.8rem;
  }

  .user-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .user-actions .p-button {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
