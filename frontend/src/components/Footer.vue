<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <span class="footer-logo">kupro</span>
        <span class="footer-tagline">Vaše mjesto za kupoprodaju</span>
      </div>
      <div class="footer-links">
        <a href="/" class="footer-link">Početna stranica</a>
        <a href="/products" class="footer-link">Proizvodi</a>
        <a href="/user-profile" class="footer-link">Profil</a>
        <a href="/cart" class="footer-link">Košarica</a>
      </div>
      <div class="footer-copy">&copy; {{ new Date().getFullYear() }} kupro</div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #1976d2;
  color: #fff;
  padding: 2rem 0 1rem 0;
  margin-top: 0;
  width: 100%;
  box-shadow: 0 -2px 8px rgba(33, 150, 243, 0.08);
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}
.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #fff;
}
.footer-tagline {
  font-size: 0.95rem;
  color: #bbdefb;
  margin-top: 0.2rem;
}
.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.footer-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.footer-link:hover,
.footer-link:focus {
  color: #bbdefb;
  text-decoration: underline;
}
.footer-copy {
  font-size: 0.95rem;
  color: #bbdefb;
  margin-top: 0.5rem;
}
</style>
