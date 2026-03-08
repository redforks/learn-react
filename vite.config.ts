import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import { defineConfig } from 'vitest/config'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mockDevServerPlugin(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    tailwindcss(),
  ],
  server: {
    strictPort: true,
    proxy: {
      '^/api': 'http://blha.com/',
    },
  },
  resolve: {
      alias: {
          "@": path.resolve(__dirname, "src"),
      }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['html'],
    },
  },
})
