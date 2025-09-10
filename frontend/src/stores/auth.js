import { defineStore } from 'pinia'
import { userService } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token') || null
    const userStr = localStorage.getItem('user')
    const role = localStorage.getItem('role') || null

    let user = null
    try {
      user = userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('❌ Error parsing user data from localStorage:', error)
      localStorage.removeItem('user') // Remove corrupted data
    }

    // If we have a token but no user data, something is wrong - clear everything
    if (token && (!user || !role)) {
      console.log('⚠️ Inconsistent auth state detected - clearing all auth data')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      return {
        token: null,
        user: null,
        role: null,
      }
    }

    // Log current session on store initialization
    if (token && user && role) {
      console.log('🔄 Session restored from localStorage:')
      console.log('👤 Current user:', user)
      console.log('🎭 User role:', role)
      console.log('🔑 Has token:', !!token)
    } else {
      console.log('❌ No active session found')
    }

    return {
      token,
      user,
      role,
    }
  },

  getters: {
    isAuthenticated: (state) => !!(state.token && state.user && state.role),
    isAdmin: (state) => state.role === 'admin',
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        console.log('🔐 Starting login process for:', credentials.username)
        const { data } = await userService.login(credentials)
        this.token = data.token
        this.user = { id: data.userId }
        this.role = data.role
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        console.log('✅ Login successful - Basic user data:', {
          userId: data.userId,
          role: data.role,
        })

        // Fetch complete user profile immediately after login
        try {
          console.log('📥 Fetching complete user profile...')
          const userProfile = await userService.getUser(data.userId)
          this.user = { ...this.user, ...userProfile.data }
          localStorage.setItem('user', JSON.stringify(this.user))
          console.log('✅ Complete user profile loaded:', this.user)
        } catch (profileError) {
          console.error('❌ Error fetching user profile after login:', profileError)
          // Continue with basic user data if profile fetch fails
          localStorage.setItem('user', JSON.stringify(this.user))
          console.log('⚠️ Continuing with basic user data:', this.user)
        }

        return data
      } catch (error) {
        console.error('❌ Login failed:', error)
        throw error.response?.data || error
      }
    },

    async logout() {
      try {
        console.log('🚪 Logging out user:', this.user)
        // Try to call the backend logout endpoint
        await userService.logout()
        console.log('✅ Backend logout successful')
      } catch (error) {
        console.error('❌ Backend logout error (continuing with local logout):', error)
        // Continue with local logout even if backend fails
      } finally {
        // Always clear local state regardless of backend response
        this.token = null
        this.user = null
        this.role = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        console.log('✅ Logout successful - User session cleared')
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

    clearAuthState() {
      console.log('🧹 Clearing auth state')
      this.token = null
      this.user = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    },

    async fetchUserProfile() {
      try {
        console.log('📥 Fetching user profile for ID:', this.user?.id)
        if (!this.user?.id) {
          throw new Error('No user ID available')
        }
        const { data } = await userService.getUser(this.user.id)
        this.user = { ...this.user, ...data }
        localStorage.setItem('user', JSON.stringify(this.user))
        console.log('✅ User profile updated:', this.user)
        return data
      } catch (error) {
        console.error('❌ Error fetching user profile:', error)
        throw error.response?.data || error
      }
    },
  },
})
