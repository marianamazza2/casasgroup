import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { staticHead } from './scripts/staticHead'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // HTML por ruta con title/description/canonical/OG + 404.html real (ver el plugin)
    staticHead(),
  ],
})
