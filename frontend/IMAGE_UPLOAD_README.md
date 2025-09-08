# Image Upload System

The new image upload system provides two convenient ways to add images to products:

## 🖼️ Features

### 1. File Upload (with ImgBB API)

- Drag & drop support
- File type validation (JPG, PNG, GIF, WebP)
- File size limit (10MB)
- Progress indicator
- Automatic upload to ImgBB

### 2. Direct URL Input

- Paste any image URL
- Live preview
- URL validation
- Suggestions for free hosting services

## 🔧 Setup Instructions

### To Enable File Upload:

1. **Get a free ImgBB API key:**
   - Visit https://api.imgbb.com/
   - Create a free account
   - Go to your dashboard
   - Copy your API key

2. **Configure the API key:**
   - Open `src/config/imageConfig.js`
   - Replace `'YOUR_IMGBB_API_KEY'` with your actual API key

### Without API Key:

- Users can still use the URL input method
- The system will suggest free image hosting services
- Perfect for development or if you don't want to use APIs

## 🚀 Usage

### For Users:

1. **File Upload Tab:**
   - Click "Učitaj sliku" tab
   - Drag & drop an image or click to browse
   - Click "Učitaj sliku" button
   - Image automatically uploads and URL is set

2. **URL Input Tab:**
   - Click "URL slike" tab
   - Paste an image URL from any hosting service
   - See live preview of the image

### For Developers:

```vue
<template>
  <ImageUpload v-model="imageUrl" label="Product Image" />
</template>

<script setup>
import ImageUpload from './components/ImageUpload.vue'
import { ref } from 'vue'

const imageUrl = ref('')
</script>
```

## 🌐 Recommended Free Image Hosting Services

If you prefer not to use the API or want alternatives:

- **ImgBB** (https://imgbb.com/) - API support, no registration required
- **PostImages** (https://postimages.org/) - Simple drag & drop
- **Imgur** (https://imgur.com/) - Popular platform

## 🔒 Security Notes

- API keys should be kept secure
- For production, consider using environment variables
- File type validation prevents malicious uploads
- Size limits prevent abuse

## 🎨 Customization

The component is fully styled and matches your blue theme (#1976d2). It's responsive and works on all devices.

### Configuration Options:

- `MAX_FILE_SIZE`: Change file size limit
- `ALLOWED_TYPES`: Modify allowed file types
- `SUGGESTED_SERVICES`: Update recommended services

## 🐛 Troubleshooting

**File upload not working?**

- Check if API key is configured correctly
- Verify internet connection
- Try the URL method as fallback

**Image not displaying?**

- Check if URL is valid and accessible
- Verify image format is supported
- Try a different hosting service
