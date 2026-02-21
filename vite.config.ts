import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({ babel: { plugins: ['relay'] } })],
  resolve: {
    alias: {
      '@design-system': path.resolve(__dirname, './src/design-system'),
    },
  },
})
