import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/startbyte/',
  build: {
    outDir: './build',
  },
  plugins: [
    tailwindcss(),
  ],
})