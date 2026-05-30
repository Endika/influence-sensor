/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/influence-sensor/',
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
  },
})
