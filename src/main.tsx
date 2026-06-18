import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({
  routeTree,
  // Precarga la ruta al pasar el cursor/foco por el link → navegación instantánea
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // Cada navegación arranca desde arriba (y restaura scroll al volver atrás)
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
