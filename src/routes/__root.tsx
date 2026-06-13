import { Link, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const subMenuServices = [
  { label: 'Administracion de fincas', gold: false, to: '/servicios/administracion-de-fincas' },
  { label: 'Cambio de suministros', gold: false, to: '/servicios/cambio-de-suministros' },
  { label: 'Hipotecas', gold: false },
  { label: 'Seguros', gold: true },
]

function SiteNav() {
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [scrolled, setScrolled] = useState(false)
  const [goldBehind, setGoldBehind] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = document.querySelector<HTMLElement>('.hero-scroll-wrapper')
      if (!wrapper) {
        setScrolled(window.scrollY > 10)
        setGoldBehind(false)
        return
      }
      const rect = wrapper.getBoundingClientRect()
      // Solid background just before the nav reaches the CASAS GROUP lettering.
      // The brand check alone is not enough: on short viewports the lettering
      // already rests near the nav, so require the hero to be sliding out too.
      const heroSliding = rect.bottom < window.innerHeight - 1
      const brand = wrapper.querySelector<HTMLElement>('.hero-brand')
      setScrolled(
        heroSliding &&
          (brand ? brand.getBoundingClientRect().top <= 72 + 90 : rect.bottom <= 72),
      )
      // Track the hero crossfade so the nav palette matches the gold render
      const scrollable = wrapper.offsetHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 1
      setGoldBehind(p >= 0.25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Pages whose hero sits behind the nav; elsewhere the nav is always solid
  const isHeroPage = pathname === '/' || pathname === '/contacto'
  const transparent = isHeroPage && !scrolled
  const overGold = transparent && goldBehind

  const navClass = [
    'site-nav',
    isHeroPage ? 'site-nav--over-hero' : '',
    transparent ? 'site-nav--transparent' : '',
    overGold ? 'site-nav--on-gold' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={navClass}>
      <Link className="logo logo-small" to="/" aria-label="Casas Group">
        <span>CASAS</span>
        <small>GROUP</small>
      </Link>
      <nav aria-label="Navegacion principal">
        <Link to="/propiedades" search={{ query: '', mode: 'compra' }}>Comprar</Link>
        <Link to="/propiedades" search={{ query: '', mode: 'alquiler' }}>Alquilar</Link>
        <Link to="/contacto" className="nav-link--quiet">Vender</Link>
        <Link to="/nosotros">Nosotros</Link>
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
              {subMenuServices.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={item.gold ? 'nav-services-item--gold' : ''}
                    onClick={() => setServicesOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href="/#servicios"
                    className={item.gold ? 'nav-services-item--gold' : ''}
                    onClick={() => setServicesOpen(false)}
                  >
                    {item.label}
                  </a>
                ),
              )}
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
