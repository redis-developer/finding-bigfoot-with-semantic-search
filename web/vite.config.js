import { defineConfig } from 'vite'
import concat from '@vituum/vite-plugin-concat'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    concat({
        input: ['app.js']
    })
  ]
})
