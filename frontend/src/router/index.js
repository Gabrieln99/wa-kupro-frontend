import { createRouter, createWebHistory } from 'vue-router'

import Admin from '@/pages/Admin.vue'
import CartPage from '@/pages/CartPage.vue'
import Home from '@/pages/Homepage.vue'
import Products from '@/pages/Products.vue'
import SingleProductPage from '@/pages/SingleProductPage.vue'
import UserProfile from '@/pages/UserProfile.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/admin', name: 'Admin', component: Admin },
    { path: '/cart', name: 'Cart', component: CartPage },
    {
      path: '/products',
      name: 'Products',
      component: Products,
      props: (route) => ({
        category: route.query.category,
        search: route.query.search,
        bidding: route.query.bidding,
      }),
    },
    {
      path: '/products/category/:category',
      name: 'ProductsByCategory',
      component: Products,
      props: true,
    },
    { path: '/products/:id', name: 'SingleProduct', component: SingleProductPage },
    { path: '/user-profile', name: 'UserProfile', component: UserProfile },
    { path: '/register', name: 'Register', component: Register },
    { path: '/login', name: 'Login', component: Login },
  ],
})

export default router
