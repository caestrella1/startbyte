import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: './build',
  },
  plugins: [
    tailwindcss(),
  ],
})