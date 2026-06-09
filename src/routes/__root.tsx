import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'

const subMenuServices = [
  { label: 'Administracion de fincas', gold: false },
  { label: 'Cambio de suministros', gold: false },
  { label: 'Hipotecas', gold: false },
  { label: 'Seguros', gold: true },
]

function SiteNav() {
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className="site-nav">
      <Link className="logo logo-small" to="/" aria-label="Casas Group">
        <span>CASAS</span>
        <small>GROUP</small>
      </Link>
      <nav aria-label="Navegacion principal">
        <a href="/#propiedades">Comprar</a>
        <a href="/#propiedades">Alquilar</a>
        <a href="/#valoracion">Vender</a>
        <a href="/#nosotros">Nosotros</a>
        <div
          className="nav-services-wrapper"
          onMouseEnter={() => setServicesOpen(true)}
          onMouseLeave={() => setServicesOpen(false)}
        >
          <button
            type="button"
            className={servicesOpen ? 'active' : ''}
            onClick={() => setServicesOpen((v) => !v)}
          >
            Servicios <span className="nav-services-arrow" aria-hidden="true">{servicesOpen ? '▲' : '▼'}</span>
          </button>
          {servicesOpen && (
            <div className="nav-services-menu">
              {subMenuServices.map((item) => (
                <a
                  key={item.label}
                  href="/#servicios"
                  className={item.gold ? 'nav-services-item--gold' : ''}
                  onClick={() => setServicesOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <Link to="/contacto">Contacto</Link>
      </nav>
    </header>
  )
}

export const Route = createRootRoute({
  component: () => (
    <>
      <SiteNav />
      <Outlet />
    </>
  ),
})
