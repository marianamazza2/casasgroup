import { Link, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatedOutlet } from '../components/AnimatedOutlet'
import { RouteProgress } from '../components/RouteProgress'

const subMenuServices = [
  { label: 'Administracion de fincas', gold: false, to: '/servicios/administracion-de-fincas' },
  { label: 'Cambio de suministros', gold: false, to: '/servicios/cambio-de-suministros' },
  { label: 'Hipotecas', gold: false, to: '/servicios/hipotecas' },
  { label: 'Seguros', gold: false, to: '/servicios/seguros' },
]

function SiteNav() {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [scrolled, setScrolled] = useState(false)
  const [goldBehind, setGoldBehind] = useState(false)
  // En desktop (> 1024px) Servicios se abre con hover; en movil/iPad solo con click
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1025px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

  // Cerrar el menu movil y el submenu al navegar a otra ruta
  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
  }, [pathname])

  // Bloquear el scroll del body mientras el panel movil esta abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Marca Servicios como activo en cualquier subpagina de /servicios
  const onServices = pathname.startsWith('/servicios')

  // Dentro de una propiedad (/propiedades/<id>) mostramos una flecha de
  // volver junto al logo en movil, al estilo Tecnocasa.
  const onPropertyDetail = /^\/propiedades\/.+/.test(pathname)

  // Pages whose hero sits behind the nav; elsewhere the nav is always solid
  const isHeroPage = pathname === '/' || pathname === '/contacto'
  const transparent = isHeroPage && !scrolled
  const overGold = transparent && goldBehind

  const navClass = [
    'site-nav',
    isHeroPage ? 'site-nav--over-hero' : '',
    transparent ? 'site-nav--transparent' : '',
    overGold ? 'site-nav--on-gold' : '',
    menuOpen ? 'site-nav--menu-open' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={navClass}>
      <div className="nav-brand">
        {onPropertyDetail && (
          <Link
            to="/propiedades"
            search={{ query: '', mode: 'compra' }}
            className="nav-back"
            aria-label="Volver a búsqueda"
          >
            <span aria-hidden="true">‹</span>
          </Link>
        )}
        <Link className="logo logo-small" to="/" aria-label="Casas Group">
          <span>CASAS</span>
          <small>GROUP</small>
        </Link>
      </div>
      <button
        type="button"
        className="nav-burger"
        aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
        aria-controls="site-nav-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="nav-burger-box" aria-hidden="true">
          <span className="nav-burger-line" />
          <span className="nav-burger-line" />
          <span className="nav-burger-line" />
        </span>
      </button>
      <button
        type="button"
        className="nav-overlay"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />
      <nav id="site-nav-menu" aria-label="Navegacion principal">
        <Link to="/propiedades" search={{ query: '', mode: 'compra' }}>Comprar</Link>
        <Link to="/propiedades" search={{ query: '', mode: 'alquiler' }}>Alquilar</Link>
        <Link to="/contacto" className="nav-link--quiet">Vender</Link>
        <Link to="/nosotros">Nosotros</Link>
        <div
          className="nav-services-wrapper"
          onMouseEnter={isDesktop ? () => setServicesOpen(true) : undefined}
          onMouseLeave={isDesktop ? () => setServicesOpen(false) : undefined}
        >
          <button
            type="button"
            className={servicesOpen || onServices ? 'active' : ''}
            onClick={() => setServicesOpen((v) => !v)}
          >
            <span className="nav-services-label">Servicios</span> <span className="nav-services-arrow" aria-hidden="true">{servicesOpen ? '▲' : '▼'}</span>
          </button>
          {servicesOpen && (
            <div className="nav-services-menu">
              <div className="nav-services-card">
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
            </div>
          )}
        </div>
        <Link to="/contacto">Contacto</Link>
      </nav>
    </header>
  )
}

function RootLayout() {
  // Barra de carga + crossfade entre pantallas (ver AnimatedOutlet).
  return (
    <>
      <RouteProgress />
      <SiteNav />
      <AnimatedOutlet />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
