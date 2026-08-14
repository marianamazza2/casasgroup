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
  // Sin esto el scroll al top hereda el `scroll-behavior: smooth` del <html>:
  // el salto se anima desde la posición anterior (p.ej. el final de la home) y,
  // como la pantalla nueva es más corta, la animación arranca ya pegada al
  // fondo (el mapa de la ficha) y tarda ~1s en subir — o se queda ahí si el
  // usuario toca la pantalla. 'instant' hace el reset en un solo frame.
  scrollRestorationBehavior: 'instant',
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
