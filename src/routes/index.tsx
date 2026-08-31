import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { animate, useInView } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { homeFeaturedProperties, properties } from '../lib/properties'
import { Footer } from '../components/Footer'
import { JsonLd } from '../components/JsonLd'
import { RevealTitle } from '../components/RevealTitle'
import { organizationSchema, absoluteUrl } from '../lib/structuredData'
import { LocationAutocomplete } from '../components/search/LocationAutocomplete'
import type { Location } from '../lib/locationSearch'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Group Casas | Inmobiliaria en Barcelona' },
      {
        name: 'description',
        content:
          'Compra, venta y alquiler de viviendas en Barcelona. Te acompañamos en hipotecas, seguros y administración de comunidades. Valoración gratuita.',
      },
      { property: 'og:title', content: 'Group Casas | Inmobiliaria en Barcelona' },
      {
        property: 'og:description',
        content:
          'Compra, venta y alquiler de viviendas en Barcelona. Hipotecas, seguros y administración de comunidades. Valoración gratuita.',
      },
      { property: 'og:url', content: absoluteUrl('/') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/') }],
  }),
  component: Home,
})

type HeroTab = 'comprar' | 'vender'

const services = [
  {
    icon: 'CO',
    title: 'Comprar',
    description: 'Encuentra tu proximo hogar o inversion. Te mostramos una seleccion de inmuebles en venta y te acompanamos durante todo el proceso para que encuentres la opcion que mejor se adapta a ti.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
    tag: 'Comprar',
    to: '/propiedades',
    search: { query: '', mode: 'compra' as const },
  },
  {
    icon: 'VE',
    title: 'Vender',
    description: 'Vende tu vivienda con el mejor asesoramiento. Realizamos una valoracion profesional y gratuita, preparamos tu inmueble y gestionamos toda la operacion para conseguir las mejores condiciones con la maxima tranquilidad.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    tag: 'Vender',
    to: '/vender',
  },
  {
    icon: 'HI',
    title: 'Financiar',
    description: 'Te conseguimos las mejores opciones de financiacion del mercado. Trabajamos con diferentes entidades financieras para encontrar las condiciones mas competitivas segun tu perfil y tus objetivos.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Financiar',
    to: '/servicios/hipotecas',
  },
  {
    icon: 'RE',
    title: 'Reformar',
    description: 'Reformamos tu vivienda de principio a fin: proyecto, obra y acabados con presupuesto cerrado, plazos comprometidos y un unico interlocutor que coordina a todos los gremios.',
    image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=80',
    tag: 'Obras',
    to: '/servicios/reformas',
  },
  {
    icon: 'AD',
    title: 'Administrar',
    description: 'Ofrecemos una gestion integral de comunidades basada en la excelencia operativa: administracion, mantenimiento, atencion a propietarios y coordinacion de todos los servicios.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    tag: 'Comunidades',
    to: '/servicios/administracion-de-comunidades',
  },
  {
    icon: 'SE',
    title: 'Seguros',
    description: 'Colaboramos con las principales aseguradoras del mercado. Analizamos coberturas, condiciones y garantias para encontrar la proteccion mas adecuada para tu vivienda, tu inversion o tu comunidad.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    tag: 'Proteccion',
    to: '/servicios/seguros',
  },
  {
    icon: 'AL',
    title: 'Alarmas',
    description: 'Analizamos tu situacion y te ayudamos a encontrar la solucion de seguridad que mejor se adapte a tu vivienda, tu inversion, tu comunidad o tu negocio, ofreciendote proteccion, tranquilidad y confianza en todo momento.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    tag: 'Seguridad',
    to: '/servicios/alarmas',
  },
  {
    icon: 'SU',
    title: 'Suministros',
    to: '/servicios/cambio-de-suministros',
    description: 'Analizamos tu perfil, comparamos las diferentes opciones disponibles en el mercado y encontramos la que mejor se adapta a tus necesidades. Ademas, gestionamos todos los tramites de principio a fin. El mejor servicio, al menor coste.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Suministros',
  },
  {
    icon: 'AQ',
    title: 'Alquilar',
    description: 'Encuentra tu proximo hogar de alquiler. Te mostramos una seleccion de inmuebles disponibles y te acompanamos durante todo el proceso para que encuentres la opcion que mejor se adapta a ti.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    tag: 'Alquilar',
    to: '/propiedades',
    search: { query: '', mode: 'alquiler' as const },
  },
]

// Bloque de marca bajo el hero: wordmark + un unico texto (antes era un slider
// de cinco caracteristicas y despues una foto protagonista con el mismo texto).
const WHY_TEXT =
  'En Group Casas te acompañamos en cada etapa. Te ayudamos a encontrar la mejor financiación para comprar tu vivienda, gestionamos el proceso de compraventa de principio a fin y, una vez adquirida, ponemos a tu disposición nuestro servicio de reformas para que esté perfecta desde el primer día. Además, administramos tu comunidad si así lo deseas. Todo lo que necesitas para tu vivienda, en un solo lugar.'

// Entrada del wordmark: la comparte con el titular de "Nuestros valores" en
// nosotros (ver componente RevealTitle).
const WORDMARK_TEXT = 'Group Casas'

function WhyWordmark() {
  return <RevealTitle text={WORDMARK_TEXT} className="why-wordmark" />
}

function Home() {
  const navigate = useNavigate()
  const [heroTab, setHeroTab] = useState<HeroTab>('comprar')
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [propertyMode, setPropertyMode] = useState<'Venta' | 'Alquiler'>('Venta')
  const [activeProperty, setActiveProperty] = useState(0)
  const propertiesRef = useRef<HTMLDivElement>(null)

  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroGoldRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)
  const heroFillRef = useRef<HTMLDivElement>(null)
  const heroUiRef = useRef<HTMLDivElement>(null)
  const [activeService, setActiveService] = useState(0)
  const serviceItemRefs = useRef<(HTMLElement | null)[]>([])

  const [skipAnimation] = useState(() => {
    try { return sessionStorage.getItem('heroSeen') === 'true' } catch { return false }
  })

  // Mark hero as seen when navigating away from home
  useEffect(() => {
    return () => {
      try { sessionStorage.setItem('heroSeen', 'true') } catch {}
    }
  }, [])

  // Apply final state immediately for returning visitors
  useLayoutEffect(() => {
    if (!skipAnimation) return
    document.documentElement.style.setProperty('--hero-fill', 'rgb(250,247,241)')
    if (heroMediaRef.current) {
      heroMediaRef.current.style.animation = 'none'
      heroMediaRef.current.style.opacity = '0'
    }
    if (heroGoldRef.current) heroGoldRef.current.style.opacity = '1'
    if (heroUiRef.current) {
      heroUiRef.current.style.opacity = '1'
      heroUiRef.current.style.transform = 'translateY(0)'
    }
    if (heroWrapperRef.current) heroWrapperRef.current.style.height = '100vh'
  }, [skipAnimation])

  useEffect(() => {
    if (skipAnimation) return

    const smoothstep = (t: number) => t * t * (3 - 2 * t)
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
    const phase = (p: number, start: number, end: number) =>
      smoothstep(clamp((p - start) / (end - start), 0, 1))

    const handleScroll = () => {
      const wrapper = heroWrapperRef.current
      if (!wrapper) return
      const top = wrapper.getBoundingClientRect().top
      const scrollable = wrapper.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = clamp(-top / scrollable, 0, 1)

      // Phase 1 (0–50%): the photo gets painted in brand gold
      const bgT = phase(p, 0, 0.5)
      if (heroMediaRef.current) heroMediaRef.current.style.opacity = String(1 - bgT)
      if (heroGoldRef.current) heroGoldRef.current.style.opacity = String(bgT)

      // Phase 2 (15–80%): brand lightens, rgb(164,123,54) → warm white
      const colorT = phase(p, 0.15, 0.8)
      const r = Math.round(164 + 86 * colorT)
      const g = Math.round(123 + 124 * colorT)
      const b = Math.round(54 + 187 * colorT)
      document.documentElement.style.setProperty('--hero-fill', `rgb(${r},${g},${b})`)

      // Phase 3 (42–72%): Tagline + tabs + search fade in
      const uiT = phase(p, 0.42, 0.72)
      if (heroUiRef.current) {
        heroUiRef.current.style.opacity = String(uiT)
        heroUiRef.current.style.transform = `translateY(${(1 - uiT) * 14}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    // Segunda pasada en el frame siguiente: al entrar desde otra ruta la salida
    // animada mantiene la pagina anterior montada un instante, asi que la
    // primera lectura puede caer con el scroll aun sin resetear y dejar el hero
    // pintado como si ya se hubiera scrolleado.
    const raf = requestAnimationFrame(handleScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handleScroll)
      // --hero-fill vive en <html> y sobrevive al cambio de ruta: sin limpiarlo,
      // contacto arrancaria con el blanco del final del scroll de la home.
      document.documentElement.style.removeProperty('--hero-fill')
    }
  }, [skipAnimation])

  useEffect(() => {
    const handleServiceScroll = () => {
      const items = serviceItemRefs.current.filter(Boolean) as HTMLElement[]
      if (!items.length) return
      const viewportCenter = window.innerHeight / 2
      let closestIdx = 0
      let closestDist = Infinity
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter)
          if (dist < closestDist) {
            closestDist = dist
            closestIdx = i
          }
        }
      })
      setActiveService(closestIdx)
    }
    window.addEventListener('scroll', handleServiceScroll, { passive: true })
    handleServiceScroll()
    return () => window.removeEventListener('scroll', handleServiceScroll)
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 1024) return
    const rail = propertiesRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>('.property-card')
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width
    rail.scrollLeft = cardWidth + 20
  }, [])

  // Mobile: el rail de propiedades es un slider horizontal; detectamos la card
  // centrada por la posicion de scroll para iluminar el dot correspondiente.
  useEffect(() => {
    const rail = propertiesRef.current
    if (!rail) return
    const handlePropertySwipe = () => {
      if (window.innerWidth > 1024) return
      const cards = Array.from(rail.querySelectorAll<HTMLElement>('.property-card'))
      if (!cards.length) return
      const center = rail.scrollLeft + rail.clientWidth / 2
      let closestIdx = 0
      let closestDist = Infinity
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < closestDist) {
          closestDist = dist
          closestIdx = i
        }
      })
      setActiveProperty(closestIdx)
    }
    if (window.innerWidth <= 1024) {
      rail.scrollLeft = 0
      setActiveProperty(0)
    }
    rail.addEventListener('scroll', handlePropertySwipe, { passive: true })
    handlePropertySwipe()
    return () => rail.removeEventListener('scroll', handlePropertySwipe)
  }, [propertyMode])

  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isSearchTab = heroTab === 'comprar'

  const displayedProperties =
    propertyMode === 'Venta'
      ? homeFeaturedProperties
      : properties.filter((p) => p.mode === 'alquiler').slice(0, 8)

  const heroCopy: Record<HeroTab, { line: string; action: string }> = {
    comprar: {
      line: 'Ingresa ciudad, provincia, barrio o zona...',
      action: 'Buscar',
    },
    vender: {
      line: 'Descubre el valor real de tu vivienda con una valoracion gratuita.',
      action: 'Solicitar valoracion',
    },
  }

  const goToResults = (query: string, loc?: Location) => {
    navigate({
      to: '/propiedades',
      search: {
        query,
        mode: 'compra',
        locType: loc?.type,
        province:
          loc?.province ?? (loc?.type === 'provincia' ? loc.name : undefined),
      },
    })
  }

  const scrollToProperty = (i: number) => {
    const rail = propertiesRef.current
    if (!rail) return
    const card = rail.querySelectorAll<HTMLElement>('.property-card')[i]
    if (!card) return
    rail.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  const scrollProperties = (direction: -1 | 1) => {
    const rail = propertiesRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>('.property-card')
    const cardWidth = card ? card.getBoundingClientRect().width : 320
    rail.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' })
  }

  // Arrastre con el mouse (desktop): click-and-drag para mover el rail. En
  // mobile el scroll táctil ya funciona, así que solo lo activamos con ratón.
  const propertyDrag = useRef({ active: false, startX: 0, startScroll: 0, moved: false })

  const onPropertyPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const rail = propertiesRef.current
    if (!rail) return
    propertyDrag.current = {
      active: true,
      startX: e.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
    }
    rail.classList.add('is-grabbing')
  }

  const onPropertyPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = propertiesRef.current
    if (!rail || !propertyDrag.current.active) return
    const dx = e.clientX - propertyDrag.current.startX
    if (Math.abs(dx) > 4 && !propertyDrag.current.moved) {
      propertyDrag.current.moved = true
      // La captura se toma solo cuando el arrastre es real. Tomarla ya en el
      // pointerdown redirige mousedown/mouseup al rail, así que el click se
      // dispara sobre el div y nunca sobre el <a> de la tarjeta: en desktop no
      // se podía abrir ninguna ficha desde el carrusel de la home.
      rail.setPointerCapture(e.pointerId)
    }
    rail.scrollLeft = propertyDrag.current.startScroll - dx
  }

  const endPropertyDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = propertiesRef.current
    if (!rail || !propertyDrag.current.active) return
    propertyDrag.current.active = false
    rail.classList.remove('is-grabbing')
    // Puede no haberse capturado nunca (click sin arrastre)
    if (rail.hasPointerCapture(e.pointerId)) {
      rail.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <main className="home-page">
      <JsonLd data={organizationSchema()} />
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="inicio">
          {/* Layer 1: same photo painted in brand gold — revealed on scroll */}
          <div className="hero-gold-bg" ref={heroGoldRef} />

          {/* Layer 2: light building photo, visible on load */}
          <div className="hero-media" ref={heroMediaRef} />

          {/* Esfumado del pie hacia la seccion siguiente. Son dos capas: la
              primera multiplica (baja los blancos de la foto por debajo del
              color de la seccion) y la segunda funde al color exacto. Van
              antes de .hero-content para que la UI del hero quede por encima. */}
          <div className="hero-fade-tint" aria-hidden="true" />
          <div className="hero-fade" aria-hidden="true" />

          {/* Layer 3 + 4: All hero content stacked */}
          <div className="hero-content">
            {/* H1 semántico de la home. La marca visible (hero-brand) es un div
                animado, así que el encabezado real va oculto pero accesible. */}
            <h1 className="visually-hidden">
              Group Casas — Inmobiliaria en Barcelona: compra, venta y alquiler de viviendas
            </h1>

            {/* CASAS GROUP brand — gold on load, lightens as the photo turns gold */}
            <div className="hero-brand" aria-label="Group Casas">
              <div className="hero-brand-fill" ref={heroFillRef}>
                <span className="hero-brand-casas">CASAS</span>
                <span className="hero-brand-group">GROUP</span>
              </div>
            </div>

            {/* Tagline + tabs + search — appears after brand */}
            <div className="hero-ui" ref={heroUiRef}>
              <p aria-hidden="true" style={{ visibility: 'hidden' }}>Tu hogar empieza aqui.</p>

              <div className="hero-tabs" role="tablist" aria-label="Servicios destacados">
                {(['comprar', 'vender'] as HeroTab[]).map((tab) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={heroTab === tab}
                    className={heroTab === tab ? 'active' : ''}
                    key={tab}
                    onClick={() => setHeroTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="hero-panel">
                <div className={`hero-cta${!isSearchTab ? ' hero-cta--solo' : ''}`}>
                  {isSearchTab ? (
                    <LocationAutocomplete
                      className="hero-search-ac"
                      inputClassName="hero-search-input"
                      ariaLabel="Buscar ubicacion"
                      placeholder={heroCopy[heroTab].line}
                      value={heroSearchQuery}
                      onChange={(v) => {
                        setHeroSearchQuery(v)
                        // Texto escrito a mano → ya no corresponde a la sugerencia elegida
                        setSelectedLocation(null)
                      }}
                      onSelect={(loc) => setSelectedLocation(loc)}
                      onSubmit={(q) => goToResults(q, selectedLocation ?? undefined)}
                    />
                  ) : (
                    // Reserva el alto del buscador para que el panel mida igual que
                    // en comprar/alquilar y el bloque del hero no se mueva al cambiar
                    // de pestaña (solo visible en mobile, ver hero-search-placeholder)
                    <span className="hero-search-input hero-search-placeholder" aria-hidden="true" />
                  )}
                  {heroTab === 'vender' ? (
                    <Link className="button-link" to="/vender">
                      {heroCopy[heroTab].action} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={!heroSearchQuery.trim()}
                      onClick={() => goToResults(heroSearchQuery.trim(), selectedLocation ?? undefined)}
                    >
                      {heroCopy[heroTab].action}
                    </button>
                  )}
                </div>
                {/* Renglón reservado en todas las pestañas para mantener el alto del panel */}
                <div className="direct-contact" style={{ visibility: 'hidden' }} aria-hidden="true">
                  Prefiero hablar con alguien <Link to="/contacto">Contactar</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint — only on first load */}
          {!skipAnimation && (
            <div className="hero-scroll-hint" aria-hidden="true">
              <span>Descúbrenos</span>
              <div className="scroll-arrow" />
            </div>
          )}
        </section>
      </div>

      <section className="section why">
        {/* Wordmark + un unico parrafo de marca, en la linea del hero pero a
            menor escala. El CTA baja al bloque de servicios. */}
        <div className="why-story">
          <WhyWordmark />
          <p className="why-story-text">{WHY_TEXT}</p>
          <button type="button" className="why-story-cta" onClick={scrollToServices}>
            Descubre nuestros servicios <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="stats">
          <Stat value="+1000" label="Operaciones" />
          <Stat value="98%" label="Satisfaccion" />
          <Stat value="45" label="Dias venta media" />
          <Stat value="+10" label="Anos experiencia" />
        </div>
      </section>

      <section className="section services" id="servicios">
        <div className="services-inner">
          <SectionHeading eyebrow="Servicios" title="Nuestros servicios" subtitle="Todo lo que necesitas para comprar, vender, financiar, proteger y gestionar tu inmueble desde un único lugar." />
          <div className="services-scroll-list">
            {services.map((svc, i) => (
              <Link
                key={svc.title}
                ref={(el) => { serviceItemRefs.current[i] = el }}
                to={svc.to ?? '/contacto'}
                search={'search' in svc ? svc.search : undefined}
                className={`service-scroll-item${activeService === i ? ' is-active' : ''}`}
              >
                <div className="service-scroll-bg" style={{ backgroundImage: `url(${svc.image})` }} />
                <div className="service-scroll-copy">
                  <p>{svc.description}</p>
                </div>
                <h3 className="service-scroll-title">{svc.title}</h3>
                <span className="service-scroll-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="valuation" id="valoracion">
        <div className="valuation-content">
          <div className="valuation-body">
            <span className="valuation-eyebrow">Valoracion gratuita</span>
            <h2 className="valuation-heading">
              Conoce el valor<br />de tu vivienda
            </h2>
            <p className="valuation-desc">
              Valoracion profesional, gratuita y sin compromiso, basada en datos reales de tu zona.
            </p>
            <Link className="button-link" to="/vender">
              Solicitar valoracion
            </Link>
            <div className="valuation-microstats">
              <span>Sin compromiso</span>
              <span>+100 operaciones cerradas</span>
            </div>
          </div>
          <div className="valuation-deco" aria-hidden="true">0€</div>
        </div>
        <div className="valuation-media" aria-hidden="true" />
      </section>

      <section className="section about-strip" id="nosotros">
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80" alt="" loading="lazy" />
        <div>
          <blockquote>Porque comprendimos que el sector no necesitaba mas de lo mismo.</blockquote>
          <p>Una marca pensada para superar expectativas, transformar la experiencia inmobiliaria y cuidar cada detalle con excelencia.</p>
          <Link className="button-link" to="/nosotros">
            Conocenos
          </Link>
        </div>
      </section>

      <section className="section properties" id="propiedades">
        <div className="section-top properties-top">
          <SectionHeading eyebrow="Inmuebles" title="Propiedades" />
          <div className="property-controls">
            <div className="pills" aria-label="Tipo de operacion">
              {(['Venta', 'Alquiler'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  className={propertyMode === mode ? 'active' : ''}
                  onClick={() => setPropertyMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="text-link properties-see-all-mobile"
              onClick={() => navigate({ to: '/propiedades', search: { query: '', mode: 'compra' } })}
            >
              Ver todas →
            </button>
          </div>
        </div>

        <div className="property-rail-wrap">
          <button
            type="button"
            className="rail-nav rail-nav-prev"
            aria-label="Propiedad anterior"
            onClick={() => scrollProperties(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <div
            className="property-rail"
            ref={propertiesRef}
            onPointerDown={onPropertyPointerDown}
            onPointerMove={onPropertyPointerMove}
            onPointerUp={endPropertyDrag}
            onPointerCancel={endPropertyDrag}
          >
            {displayedProperties.map((property) => (
              // Enlace real (<a href>) para que Google siga el grafo desde la
              // home a cada ficha (§9). El rail es arrastrable: si hubo drag,
              // cancelamos la navegación con preventDefault.
              <Link
                className="property-card"
                key={property.id}
                to="/propiedades/$id"
                params={{ id: String(property.id) }}
                onClick={(e) => {
                  if (propertyDrag.current.moved) e.preventDefault()
                }}
              >
                <div className="property-image">
                  <img src={property.image} alt={`${property.title} en ${property.zone}`} draggable={false} loading="lazy" />
                  {property.tag ? <span>{property.tag}</span> : null}
                </div>
                <div className="property-body">
                  <small>{property.zone}</small>
                  <h3>{property.title}</h3>
                  <p>
                    {property.beds} hab · {property.baths} banos · {property.m2} m2
                  </p>
                  <strong>{property.priceLabel}</strong>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="rail-nav rail-nav-next"
            aria-label="Propiedad siguiente"
            onClick={() => scrollProperties(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="property-dots" role="tablist" aria-label="Propiedades">
          {displayedProperties.map((property, i) => (
            <button
              type="button"
              key={property.id}
              className={i === activeProperty ? 'property-dot active' : 'property-dot'}
              aria-label={`Ir a la propiedad ${i + 1}`}
              aria-selected={i === activeProperty}
              onClick={() => scrollToProperty(i)}
            />
          ))}
        </div>

        <button className="text-link" type="button" onClick={() => navigate({ to: '/propiedades', search: { query: '', mode: 'compra' } })}>
          Ver todas las propiedades →
        </button>
      </section>

      <Footer />
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  const match = value.match(/^(\D*)(\d+)(\D*)$/)
  const prefix = match ? match[1] : ''
  const target = match ? parseInt(match[2], 10) : 0
  const suffix = match ? match[3] : ''
  const hasNumber = match !== null

  useEffect(() => {
    if (!inView || !hasNumber) return
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, hasNumber, target])

  return (
    <div ref={ref}>
      <strong>
        {hasNumber ? `${prefix}${display}${suffix}` : value}
      </strong>
      <span>{label}</span>
    </div>
  )
}
