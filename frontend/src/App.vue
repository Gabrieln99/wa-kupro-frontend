<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <RouterView />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style>
/* Global reset and layout */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

/* Dark Mode Support */
:root {
  /* Light theme colors */
  --app-bg-color: #ffffff;
  --app-text-color: #1f2937;
  --app-text-secondary: #6b7280;
  --app-border-color: #e5e7eb;
  --app-surface-color: #ffffff;
  --app-surface-secondary: #f9fafb;
  --app-shadow: rgba(0, 0, 0, 0.1);

  /* Primary colors (consistent across themes) */
  --p-primary-50: #eff6ff !important;
  --p-primary-100: #dbeafe !important;
  --p-primary-200: #bfdbfe !important;
  --p-primary-300: #93c5fd !important;
  --p-primary-400: #60a5fa !important;
  --p-primary-500: #3b82f6 !important;
  --p-primary-600: #2563eb !important;
  --p-primary-700: #1d4ed8 !important;
  --p-primary-800: #1e40af !important;
  --p-primary-900: #1e3a8a !important;
  --p-primary-950: #172554 !important;

  --primary-color: #3b82f6 !important;
  --primary-color-text: #ffffff !important;

  /* Button colors */
  --p-button-primary-background: #3b82f6 !important;
  --p-button-primary-border-color: #3b82f6 !important;
  --p-button-primary-color: #ffffff !important;
  --p-button-primary-hover-background: #2563eb !important;
  --p-button-primary-hover-border-color: #2563eb !important;
  --p-button-primary-active-background: #1d4ed8 !important;
  --p-button-primary-active-border-color: #1d4ed8 !important;

  /* Input focus colors */
  --p-inputtext-focus-border-color: #3b82f6 !important;
  --p-password-focus-border-color: #3b82f6 !important;
  --p-checkbox-checked-background: #3b82f6 !important;
  --p-checkbox-checked-border-color: #3b82f6 !important;

  /* Avatar background */
  --p-avatar-background: #3b82f6 !important;
  --p-avatar-color: #ffffff !important;
}

/* Dark theme colors */
@media (prefers-color-scheme: dark) {
  :root {
    --app-bg-color: #111827;
    --app-text-color: #f9fafb;
    --app-text-secondary: #d1d5db;
    --app-border-color: #374151;
    --app-surface-color: #1f2937;
    --app-surface-secondary: #374151;
    --app-shadow: rgba(0, 0, 0, 0.3);

    /* PrimeVue dark theme overrides */
    --p-surface-0: #111827 !important;
    --p-surface-50: #1f2937 !important;
    --p-surface-100: #374151 !important;
    --p-surface-200: #4b5563 !important;
    --p-surface-300: #6b7280 !important;
    --p-surface-400: #9ca3af !important;
    --p-surface-500: #d1d5db !important;
    --p-surface-600: #e5e7eb !important;
    --p-surface-700: #f3f4f6 !important;
    --p-surface-800: #f9fafb !important;
    --p-surface-900: #ffffff !important;
    --p-surface-950: #ffffff !important;

    --p-content-color: #f9fafb !important;
    --p-text-color: #f9fafb !important;
    --p-text-muted-color: #d1d5db !important;

    /* Input backgrounds for dark mode */
    --p-inputtext-background: #374151 !important;
    --p-inputtext-border-color: #4b5563 !important;
    --p-inputtext-color: #f9fafb !important;
    --p-inputtext-placeholder-color: #9ca3af !important;

    /* Dropdown/Select backgrounds */
    --p-dropdown-background: #374151 !important;
    --p-dropdown-border-color: #4b5563 !important;
    --p-dropdown-color: #f9fafb !important;

    /* Card/Panel backgrounds */
    --p-card-background: #1f2937 !important;
    --p-card-border-color: #374151 !important;
    --p-card-color: #f9fafb !important;
  }

  /* Apply dark theme to body */
  body {
    background-color: var(--app-bg-color);
    color: var(--app-text-color);
  }
}

/* More specific component overrides */
.p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-secondary) {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #ffffff !important;
}

.p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-secondary):hover {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: #ffffff !important;
}

.p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-secondary):active,
.p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-secondary):focus {
  background: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
  color: #ffffff !important;
}

.p-inputtext:enabled:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2) !important;
}

.p-password:focus-within .p-password-input {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2) !important;
}

.p-checkbox .p-checkbox-box.p-highlight {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.p-avatar {
  background: #3b82f6 !important;
  color: #ffffff !important;
}

/* Text primary color for links */
.text-primary {
  color: #3b82f6 !important;
}

/* Loading state for buttons */
.p-button .p-button-loading-icon {
  color: #ffffff !important;
}

/* Global dark mode classes */
.dark-theme {
  background-color: var(--app-bg-color);
  color: var(--app-text-color);
}

/* Custom dark mode input styles */
@media (prefers-color-scheme: dark) {
  .p-inputtext,
  .p-password-input,
  .p-dropdown,
  .p-multiselect,
  .p-textarea {
    background-color: var(--p-inputtext-background) !important;
    border-color: var(--p-inputtext-border-color) !important;
    color: var(--p-inputtext-color) !important;
  }

  .p-inputtext::placeholder,
  .p-password-input::placeholder,
  .p-textarea::placeholder {
    color: var(--p-inputtext-placeholder-color) !important;
  }

  /* Dark mode card styles */
  .p-card {
    background-color: var(--p-card-background) !important;
    border-color: var(--p-card-border-color) !important;
    color: var(--p-card-color) !important;
  }

  /* Dark mode panel styles */
  .p-panel .p-panel-header,
  .p-panel .p-panel-content {
    background-color: var(--p-card-background) !important;
    color: var(--p-card-color) !important;
  }

  /* Dark mode dropdown menu */
  .p-dropdown-panel,
  .p-multiselect-panel {
    background-color: var(--p-surface-50) !important;
    border-color: var(--p-surface-100) !important;
  }

  .p-dropdown-item,
  .p-multiselect-item {
    color: var(--p-text-color) !important;
  }

  .p-dropdown-item:hover,
  .p-multiselect-item:hover {
    background-color: var(--p-surface-100) !important;
  }

  /* Dark mode for overlays */
  .p-overlay-modal {
    background-color: rgba(17, 24, 39, 0.8) !important;
  }

  .p-dialog .p-dialog-header,
  .p-dialog .p-dialog-content {
    background-color: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
  }

  /* Dark mode table styles */
  .p-datatable .p-datatable-thead > tr > th,
  .p-datatable .p-datatable-tbody > tr > td {
    background-color: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-surface-100) !important;
  }

  /* Dark mode toast styles */
  .p-toast .p-toast-message {
    background-color: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
  }
}
</style>
