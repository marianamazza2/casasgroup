import { HeadContent, Link, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatedOutlet } from '../components/AnimatedOutlet'
import { RouteProgress } from '../components/RouteProgress'
import { useScrollRestoreRetry } from '../hooks/useScrollRestoreRetry'
import { absoluteUrl } from '../lib/structuredData'

const subMenuServices = [
  { label: 'Administrar', gold: false, to: '/servicios/administracion-de-fincas' },
  { label: 'Alarmas', gold: false, to: '/servicios/alarmas' },
  { label: 'Alquilar', gold: false, to: '/propiedades', search: { query: '', mode: 'alquiler' as const } },
  { label: 'Hipotecas', gold: false, to: '/servicios/hipotecas' },
  { label: 'Reformas', gold: false, to: '/servicios/reformas' },
  { label: 'Seguros', gold: false, to: '/servicios/seguros' },
  { label: 'Suministros', gold: false, to: '/servicios/cambio-de-suministros' },
]

function SiteNav() {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // Incluye los search params: navegar a la misma ruta cambiando el modo
  // (Comprar -> Alquilar) no altera el pathname pero si esta clave.
  const locationKey = useRouterState({ select: (s) => s.location.href })
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

  // Cerrar el menu movil y el submenu al navegar (incluso si solo cambian
  // los search params, p.ej. Comprar -> Alquilar dentro de /propiedades)
  useEffect(() => {
    // Si la navegacion viene del menu movil (estaba abierto), forzamos scroll
    // al top: en movil el burger se abre estando scrolleado abajo y la
    // restauracion de scroll de TanStack no resetea de forma fiable por el
    // remontaje animado del AnimatedOutlet, dejando la nueva pantalla en el
    // footer. Solo afecta a la navegacion hacia delante desde el menu (en
    // "atras" el menu esta cerrado, asi que la restauracion sigue intacta).
    // La restauracion de TanStack puede correr en un frame posterior y volver
    // a empujar abajo, asi que re-aseguramos el top en el siguiente frame.
    if (menuOpen) {
      const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
      toTop()
      const raf = requestAnimationFrame(toTop)
      setMenuOpen(false)
      setServicesOpen(false)
      return () => cancelAnimationFrame(raf)
    }
    setMenuOpen(false)
    setServicesOpen(false)
  }, [locationKey])

  // Bloquear el scroll del body mientras el panel movil esta abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Marca Servicios como activo en cualquier subpagina de /servicios
  const onServices = pathname.startsWith('/servicios')

  // Dentro de una propiedad (/propiedades/<id>) ocultamos la cabecera en
  // movil: la foto va a sangre y se navega con un boton flotante de volver
  // (estilo Airbnb). Ver .site-nav--property y .detail-back-fab.
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
    onPropertyDetail ? 'site-nav--property' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={navClass}>
      <div className="nav-brand">
        <Link
          className="logo logo-small"
          to="/"
          aria-label="Group Casas"
          onClick={() => {
            if (pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
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
        <Link to="/vender" className="nav-link--quiet">Vender</Link>
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
                    search={item.search}
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
  // Al volver atrás, reaplica la posición guardada cuando la pantalla ya ha
  // montado (TanStack la aplica demasiado pronto y se recorta). Ver el hook.
  useScrollRestoreRetry({ getElement: () => window })

  // Barra de carga + crossfade entre pantallas (ver AnimatedOutlet).
  return (
    <>
      <HeadContent />
      <RouteProgress />
      <SiteNav />
      <AnimatedOutlet />
    </>
  )
}

export const Route = createRootRoute({
  // Defaults globales de <head>. Cada ruta declara su propio head() con title,
  // description y canonical; estos valores actúan de base y se heredan salvo que
  // la ruta los sobrescriba. Se renderizan vía <HeadContent /> en RootLayout.
  head: () => ({
    meta: [
      // Título/description por defecto: sirven de fallback para las rutas que aún
      // no declaran su propio <Seo> (el <title> estático del index.html se quitó).
      // Las páginas con <Seo> los sobrescriben en cliente.
      { title: 'Group Casas | Inmobiliaria en Barcelona' },
      {
        name: 'description',
        content:
          'Inmobiliaria en Barcelona: compra, venta y alquiler de viviendas. Hipotecas, seguros y administración de fincas. Valoración gratuita.',
      },
      { property: 'og:site_name', content: 'Group Casas' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'es_ES' },
      // Imagen por defecto al compartir (WhatsApp/Facebook/X). Las rutas con foto
      // propia (p.ej. la ficha = foto de portada) la sobrescriben vía <Seo image>.
      { property: 'og:image', content: absoluteUrl('/og-default.jpg') },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: absoluteUrl('/og-default.jpg') },
    ],
  }),
  component: RootLayout,
})
