import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    /* Не качать react/router параллельно с entry — типичный баг на мобилке */
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'motion'
          /* react + router одним файлом — один запрос, не 3 сразу */
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('react/')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})
