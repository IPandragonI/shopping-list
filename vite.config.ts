import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/shopping-list/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                list: resolve(__dirname, 'list.html'),
            },
        }
    },
    plugins: [
        tailwindcss(),
    ],
})