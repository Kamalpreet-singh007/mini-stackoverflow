import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: true, // equivalent to --host
    port: 5173,
    strictPort: true, 
    watch: {
      usePolling: true,
    },
  },
})
