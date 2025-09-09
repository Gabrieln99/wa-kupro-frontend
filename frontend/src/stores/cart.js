import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart')
    let cartItems = []

    try {
      cartItems = savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('❌ Error parsing cart data from localStorage:', error)
      localStorage.removeItem('cart')
      cartItems = []
    }

    return {
      items: cartItems,
      isLoading: false,
    }
  },

  getters: {
    // Total number of items in cart
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // Total price of all items in cart
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    // Check if specific product is in cart
    isInCart: (state) => (productId) => {
      return state.items.some((item) => item.id === productId)
    },

    // Get quantity of specific product in cart
    getQuantity: (state) => (productId) => {
      const item = state.items.find((item) => item.id === productId)
      return item ? item.quantity : 0
    },
  },

  actions: {
    // Add item to cart
    addToCart(product) {
      console.log('🛒 Adding to cart:', product.name)

      // Check if product is available for purchase
      if (product.stock <= 0) {
        throw new Error('Proizvod nije dostupan')
      }

      // Check if product is in bidding and not ended
      if (product.isBidding && !this.isBiddingEnded(product)) {
        throw new Error('Proizvod je trenutno na licitaciji')
      }

      // Check if product is reserved for someone else
      if (product.biddingStatus === 'reserved' || product.reservedForWinner) {
        throw new Error('Proizvod je rezerviran za pobjednika licitacije')
      }

      const existingItem = this.items.find((item) => item.id === product._id)

      if (existingItem) {
        // If item already in cart, check if we can increase quantity
        if (existingItem.quantity >= product.stock) {
          throw new Error(`Maksimalna količina za ${product.name} je ${product.stock}`)
        }
        existingItem.quantity += 1
      } else {
        // Add new item to cart
        this.items.push({
          id: product._id,
          name: product.name,
          image: product.image,
          price: product.currentPrice,
          quantity: 1,
          maxStock: product.stock,
          category: product.category,
          isBidding: product.isBidding,
          biddingStatus: product.biddingStatus,
        })
      }

      this.saveToLocalStorage()
      console.log('✅ Item added to cart successfully')
    },

    // Remove item from cart
    removeFromCart(productId) {
      console.log('🗑️ Removing from cart:', productId)
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveToLocalStorage()
    },

    // Update item quantity
    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else if (quantity <= item.maxStock) {
          item.quantity = quantity
          this.saveToLocalStorage()
        } else {
          throw new Error(`Maksimalna količina je ${item.maxStock}`)
        }
      }
    },

    // Clear entire cart
    clearCart() {
      console.log('🧹 Clearing cart')
      this.items = []
      this.saveToLocalStorage()
    },

    // Save cart to localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.items))
      } catch (error) {
        console.error('❌ Error saving cart to localStorage:', error)
      }
    },

    // Helper method to check if bidding has ended
    isBiddingEnded(product) {
      if (!product.isBidding) return false
      if (product.biddingStatus === 'ended' || product.biddingStatus === 'sold') return true
      if (product.biddingEndTime && new Date() >= new Date(product.biddingEndTime)) return true
      return false
    },

    // Purchase all items in cart
    async purchaseCart(paymentMethod = 'card') {
      console.log('💳 Processing cart purchase...')
      this.isLoading = true

      try {
        if (this.items.length === 0) {
          throw new Error('Košarica je prazna')
        }

        // Simulate purchase processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real app, you would send this to your backend
        const purchaseData = {
          items: this.items,
          totalPrice: this.totalPrice,
          paymentMethod,
          timestamp: new Date().toISOString(),
        }

        console.log('✅ Purchase completed:', purchaseData)

        // Clear cart after successful purchase
        this.clearCart()

        return {
          success: true,
          orderId: `ORDER-${Date.now()}`,
          ...purchaseData,
        }
      } catch (error) {
        console.error('❌ Purchase failed:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
