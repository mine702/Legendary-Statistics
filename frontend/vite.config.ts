import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
  define: {global: 'window'}
})
