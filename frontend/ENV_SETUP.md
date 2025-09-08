# Environment Configuration

This project uses environment variables to configure API endpoints for different environments.

## Setup

1. **Development Environment:**

   ```bash
   cp .env.development.example .env.development
   ```

   Edit `.env.development` with your local backend URL (usually `http://localhost:3000/api`)

2. **Production Environment:**
   ```bash
   cp .env.production.example .env.production
   ```
   Edit `.env.production` with your production backend URL

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for API calls
- `VITE_BACKEND_BASE_URL` - Base URL for backend services (images, etc.)

## Important Notes

- ⚠️ Never commit actual `.env` files to git - they contain sensitive information
- ✅ The `.env.*.example` files are templates that can be safely committed
- 🔧 Netlify will automatically use `.env.production` values when building for production
- 🏠 Local development will use `.env.development` values

## Current Configuration

- **Development:** `http://localhost:3000/api`
- **Production:** `https://wa-kupro-backend.onrender.com/api`
