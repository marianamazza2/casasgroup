import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFound } from './components/NotFound'
import './index.css'

const router = createRouter({
  routeTree,
  // Precarga la ruta al pasar el cursor/foco por el link → navegación instantánea
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // Cada navegación arranca desde arriba (y restaura scroll al volver atrás)
  scrollRestoration: true,
  // 404 global (auditoría §8): cualquier URL sin ruta que coincida renderiza
  // esta pantalla (con la navbar del layout raíz), no un shell vacío.
  defaultNotFoundComponent: NotFound,
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
