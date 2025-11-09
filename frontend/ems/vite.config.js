// import { defineConfig } from 'vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/sample-csv': 'http://localhost:3001', 
    },
  },
  plugins: [react()]
})