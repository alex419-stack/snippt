import { defineConfig } from 'vitest/config'

// Reine Logik-Tests (keine DOM-/React-Umgebung nötig).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
})
