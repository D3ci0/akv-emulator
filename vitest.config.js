import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8', // or 'v8' (but 'c8' gives better compatibility)
            reportsDirectory: './coverage',
            reporter: ['text', 'lcov'],
            exclude: ['**/node_modules/**', '**/tests/**'],
        },
    },
})
