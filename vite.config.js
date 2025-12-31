import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/startbyte/',
  build: {
    outDir: './build',
  },
  plugins: [
    svgr(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'ui': resolve(__dirname, 'src/components/ui'),
      'widgets': resolve(__dirname, 'src/components/widgets'),
      'components': resolve(__dirname, 'src/components'),
      'utils': resolve(__dirname, 'src/utils'),
      'assets': resolve(__dirname, 'src/assets'),
      'hooks': resolve(__dirname, 'src/hooks'),
    },
  },
})