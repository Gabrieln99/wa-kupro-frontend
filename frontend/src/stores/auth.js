import { defineStore } from 'pinia'
import { userService } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    role: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const { data } = await userService.login(credentials)
        this.token = data.token
        this.user = { id: data.userId }
        this.role = data.role
        localStorage.setItem('token', data.token)
        return data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async logout() {
      try {
        await userService.logout()
        this.token = null
        this.user = null
        this.role = null
        localStorage.removeItem('token')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async register(userData) {
      try {
        const { data } = await userService.register(userData)
        return data
      } catch (error) {
        throw error.response?.data || error
      }
    },
  },
})
