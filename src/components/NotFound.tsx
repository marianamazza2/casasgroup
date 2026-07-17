import { Link } from '@tanstack/react-router'
import { Seo } from './Seo'

// 404 global (auditoría §8). Se monta como `defaultNotFoundComponent` del router
// (ver main.tsx): cualquier URL que no casa con una ruta cae aquí, en lugar de
// dejar el shell vacío. Lleva <Seo noindex> para que Google no lo indexe como
// contenido pobre (mitiga el soft-404 mientras la web sea SPA sin SSR; con
// prerender/SSR —§1.1— habrá que devolver además un status 404 real).
export function NotFound() {
  return (
    <main className="notfound-page">
      <Seo title="Página no encontrada | Group Casas" noindex />
      <div className="notfound-inner">
        <span className="notfound-code" aria-hidden="true">404</span>
        <h1 className="notfound-title">Esta página no existe</h1>
        <p className="notfound-text">
          Puede que el enlace esté roto o que la página se haya movido.
          Volvamos a un lugar conocido.
        </p>
        <div className="notfound-actions">
          <Link className="button-link" to="/">Ir al inicio</Link>
          <Link
            className="notfound-link"
            to="/propiedades"
            search={{ query: '', mode: 'compra' }}
          >
            Ver propiedades →
          </Link>
        </div>
      </div>
    </main>
  )
}
