import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const isTest = process.env.VITEST === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    isTest
      ? react({
          babel: {
            plugins: [['babel-plugin-react-compiler', {}]],
          },
        })
      : reactRouter(),
    tailwindcss(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
