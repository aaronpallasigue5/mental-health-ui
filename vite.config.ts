import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/mental-health-ui/', // DAPAT MERON NITO PARA SA GITHUB PAGES
})