import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
    plugins: [react(), viteSingleFile()],
    base: './',
    build: {
        emptyOutDir: false, // Critical: Don't delete the widget build!
        rollupOptions: {
            input: {
                settings: 'settings.html'
            }
        }
    }
})
