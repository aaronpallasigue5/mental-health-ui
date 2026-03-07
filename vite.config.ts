import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // FIXED: Use @vitejs/plugin-vue
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  // This matches your GitHub repository name exactly
  base: '/mental-health-ui/', 
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})