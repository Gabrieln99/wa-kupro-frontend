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
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

/* Global blue theme overrides */
:root {
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
</style>
