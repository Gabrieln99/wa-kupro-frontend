import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)

export const userService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  getUsers: () => api.get('/users/users'),
  getUser: (id) => api.get(`/users/user/${id}`),
  deleteUser: (id) => api.delete(`/users/user/${id}`),
  promoteUser: (id) => api.patch(`/users/promote/${id}`),
}

export const productService = {
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams()

    // Add search and filter parameters
    if (params.searchTerm) queryParams.append('search', params.searchTerm)
    if (params.category) queryParams.append('category', params.category)
    if (params.priceMin) queryParams.append('priceMin', params.priceMin)
    if (params.priceMax) queryParams.append('priceMax', params.priceMax)
    if (params.biddingStatus) queryParams.append('biddingStatus', params.biddingStatus)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.userId) queryParams.append('userId', params.userId)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)

    const queryString = queryParams.toString()
    return api.get(`/products${queryString ? `?${queryString}` : ''}`)
  },
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  placeBid: (id, bidData) => api.post(`/products/${id}/bid`, bidData),
  getBidHistory: (id) => api.get(`/products/${id}/bids`),
  getActiveBiddings: () => api.get('/products/bidding/active'),
  getReservedProducts: (userEmail) => api.get(`/products/reserved/${userEmail}`),
  getCategories: () => api.get('/products/util/categories'),
  getBiddingStatus: () => api.get('/products/bidding/status'),

  // Purchase methods
  purchaseProduct: (id, purchaseData) => api.post(`/products/${id}/purchase`, purchaseData),
  purchaseCart: (cartData) => api.post('/products/purchase/batch', cartData),
}

export default api
