import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { animate, motion, useInView } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { homeFeaturedProperties, properties } from '../lib/propertiesData'
import { Footer } from '../components/Footer'
import { LocationAutocomplete } from '../components/search/LocationAutocomplete'
import type { Location } from '../lib/locationSearch'

export const Route = createFileRoute('/')({
  component: Home,
})

type HeroTab = 'comprar' | 'alquilar' | 'vender' | 'reformas' | 'hipotecas'

const services = [
  {
    icon: 'AD',
    title: 'Administracion de fincas',
    description: 'Gestion integral de comunidades con transparencia y seguimiento cercano. Cuentas, mantenimiento y comunicacion con propietarios, todo en orden.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    tag: 'Comunidades',
    to: '/servicios/administracion-de-fincas',
  },
  {
    icon: 'HI',
    title: 'Hipotecas',
    description: 'Te ayudamos a encontrar la financiacion que mejor encaja con tu compra. Comparamos entre varias entidades para que elijas con criterio.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Financiacion',
    to: '/servicios/hipotecas',
  },
  {
    icon: 'SU',
    title: 'Cambio de suministros',
    to: '/servicios/cambio-de-suministros',
    description: 'Luz, gas y agua gestionados sin que muevas un dedo. Nos encargamos de todos los tramites del cambio para que tu solo pienses en instalarte.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    tag: 'Suministros',
  },
  {
    icon: 'SE',
    title: 'Seguros',
    description: 'Proteccion para vivienda, propietario e inquilino desde el primer dia. Coberturas personalizadas con las mejores companias del mercado.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    tag: 'Proteccion',
    to: '/servicios/seguros',
  },
]

const whyItems = [
  {
    title: 'Excelencia en cada detalle',
    description:
      'Cuidamos cada paso del proceso para que la experiencia sea clara, elegante y bien acompanada desde el primer contacto.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Trato cercano y personal',
    description:
      'Detras de cada operacion hay personas. Escuchamos, asesoramos y mantenemos una comunicacion directa.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Conocimiento local real',
    description:
      'Trabajamos con datos reales de mercado y conocimiento de zona para tomar mejores decisiones.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
]

const accessBlocks = [
  {
    title: 'Comprar',
    description: 'Encuentra tu proximo hogar entre una seleccion cuidada de inmuebles.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80',
    to: '/propiedades' as const,
    search: { query: '', mode: 'compra' as const },
  },
  {
    title: 'Alquilar',
    description: 'Pisos y casas listos para entrar a vivir con una gestion agil.',
    image:
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=80',
    to: '/propiedades' as const,
    search: { query: '', mode: 'alquiler' as const },
  },
  {
    title: 'Vender',
    description: 'Descubre el valor real de tu vivienda con una valoracion profesional.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    to: '/vender' as const,
  },
]

function Home() {
  const navigate = useNavigate()
  const [heroTab, setHeroTab] = useState<HeroTab>('comprar')
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [propertyMode, setPropertyMode] = useState<'Venta' | 'Alquiler'>('Venta')
  const [whyIndex, setWhyIndex] = useState(0)
  const [activeProperty, setActiveProperty] = useState(0)
  const propertiesRef = useRef<HTMLDivElement>(null)

  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroGoldRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)
  const heroFillRef = useRef<HTMLDivElement>(null)
  const heroUiRef = useRef<HTMLDivElement>(null)
  const accessSectionRef = useRef<HTMLElement>(null)
  const [activeAccessBlock, setActiveAccessBlock] = useState<number | null>(null)
  const [activeService, setActiveService] = useState(0)
  const serviceItemRefs = useRef<(HTMLElement | null)[]>([])
  const servicesListRef = useRef<HTMLDivElement | null>(null)

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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [skipAnimation])

  useEffect(() => {
    const handleAccessScroll = () => {
      const section = accessSectionRef.current
      if (!section) return
      const items = section.querySelectorAll<HTMLElement>('.access-block-item')
      if (!items.length) return

      const viewportCenter = window.innerHeight / 2
      let closestIdx: number | null = null
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

      setActiveAccessBlock(closestIdx)
    }

    window.addEventListener('scroll', handleAccessScroll, { passive: true })
    handleAccessScroll()
    return () => window.removeEventListener('scroll', handleAccessScroll)
  }, [])

  useEffect(() => {
    const handleServiceScroll = () => {
      if (window.innerWidth <= 1024) return
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

  // Mobile: el listado de servicios es un slider horizontal; detectamos la card
  // centrada por la posicion de scroll del propio contenedor.
  useEffect(() => {
    const list = servicesListRef.current
    if (!list) return
    const handleServiceSwipe = () => {
      if (window.innerWidth > 1024) return
      const items = serviceItemRefs.current.filter(Boolean) as HTMLElement[]
      if (!items.length) return
      const center = list.scrollLeft + list.clientWidth / 2
      let closestIdx = 0
      let closestDist = Infinity
      items.forEach((item, i) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2
        const dist = Math.abs(itemCenter - center)
        if (dist < closestDist) {
          closestDist = dist
          closestIdx = i
        }
      })
      setActiveService(closestIdx)
    }
    list.addEventListener('scroll', handleServiceSwipe, { passive: true })
    handleServiceSwipe()
    return () => list.removeEventListener('scroll', handleServiceSwipe)
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

  const scrollToService = (i: number) => {
    const list = servicesListRef.current
    const item = serviceItemRefs.current[i]
    if (!list || !item) return
    list.scrollTo({
      left: item.offsetLeft + item.offsetWidth / 2 - list.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  const currentWhy = whyItems[whyIndex]
  const isSearchTab = heroTab === 'comprar' || heroTab === 'alquilar'

  const displayedProperties =
    propertyMode === 'Venta'
      ? homeFeaturedProperties
      : properties.filter((p) => p.mode === 'alquiler').slice(0, 8)

  const heroCopy: Record<HeroTab, { line: string; action: string }> = {
    comprar: {
      line: 'Ingresa ciudad, provincia, barrio o zona...',
      action: 'Buscar',
    },
    alquilar: {
      line: 'Ingresa ciudad, provincia, barrio o zona...',
      action: 'Buscar',
    },
    vender: {
      line: 'Descubre el valor real de tu vivienda con una valoracion gratuita.',
      action: 'Solicitar valoracion',
    },
    reformas: {
      line: 'Transforma tu hogar con nuestro equipo de profesionales.',
      action: 'Solicitar presupuesto',
    },
    hipotecas: {
      line: 'Te ayudamos a encontrar la mejor financiacion para tu nuevo hogar.',
      action: 'Hablar con un asesor',
    },
  }

  const goToResults = (query: string, loc?: Location) => {
    navigate({
      to: '/propiedades',
      search: {
        query,
        mode: heroTab === 'alquilar' ? 'alquiler' : 'compra',
        locType: loc?.type,
        province:
          loc?.province ?? (loc?.type === 'provincia' ? loc.name : undefined),
      },
    })
  }

  const nextWhy = (direction: -1 | 1) => {
    setWhyIndex((current) => (current + direction + whyItems.length) % whyItems.length)
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

  return (
    <main className="home-page">
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="inicio">
          {/* Layer 1: same photo painted in brand gold — revealed on scroll */}
          <div className="hero-gold-bg" ref={heroGoldRef} />

          {/* Layer 2: light building photo, visible on load */}
          <div className="hero-media" ref={heroMediaRef} />

          {/* Layer 3 + 4: All hero content stacked */}
          <div className="hero-content">
            {/* CASAS GROUP brand — gold on load, lightens as the photo turns gold */}
            <div className="hero-brand" aria-label="Casas Group">
              <div className="hero-brand-fill" ref={heroFillRef}>
                <span className="hero-brand-casas">CASAS</span>
                <span className="hero-brand-group">GROUP</span>
              </div>
            </div>

            {/* Tagline + tabs + search — appears after brand */}
            <div className="hero-ui" ref={heroUiRef}>
              <p aria-hidden="true" style={{ visibility: 'hidden' }}>Tu hogar empieza aqui.</p>

              <div className="hero-tabs" role="tablist" aria-label="Servicios destacados">
                {(['comprar', 'alquilar', 'vender', 'reformas', 'hipotecas'] as HeroTab[]).map((tab) => (
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
                  {isSearchTab && (
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
                  )}
                  {heroTab === 'vender' ? (
                    <Link className="button-link" to="/vender">
                      {heroCopy[heroTab].action} <span aria-hidden="true">→</span>
                    </Link>
                  ) : isSearchTab ? (
                    <button
                      type="button"
                      disabled={!heroSearchQuery.trim()}
                      onClick={() => goToResults(heroSearchQuery.trim(), selectedLocation ?? undefined)}
                    >
                      {heroCopy[heroTab].action}
                    </button>
                  ) : (
                    <Link className="button-link" to="/contacto">
                      {heroCopy[heroTab].action} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
                {isSearchTab && (
                  <div className="direct-contact" style={{ visibility: 'hidden' }} aria-hidden="true">
                    Prefiero hablar con alguien <Link to="/contacto">Contactar</Link>
                  </div>
                )}
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

      <section className="section services" id="servicios">
        <div className="services-inner">
          <SectionHeading eyebrow="Servicios" title="Nuestros servicios" subtitle="Todo lo que necesitas en un solo lugar." />
          <div className="services-sticky-layout">
            <div className="services-image-panel">
              {services.map((svc, i) => (
                <div
                  key={svc.title}
                  className={`services-image-layer${activeService === i ? ' active' : ''}`}
                  style={{ backgroundImage: `url(${svc.image})` }}
                />
              ))}
              <div className="services-image-overlay" />
              <motion.div
                key={`svc-tag-${activeService}`}
                className="services-image-tag"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <span>{String(activeService + 1).padStart(2, '0')}</span>
                {services[activeService].tag}
              </motion.div>
            </div>

            <div className="services-list" ref={servicesListRef}>
              {services.map((svc, i) => (
                <article
                  key={svc.title}
                  ref={(el) => { serviceItemRefs.current[i] = el }}
                  className={`services-list-item${activeService === i ? ' active' : ''}`}
                >
                  <span className="services-list-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="services-list-body">
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    <Link className="services-list-link" to={svc.to ?? '/contacto'}>Consultar →</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="services-dots">
            {services.map((svc, i) => (
              <button
                key={svc.title}
                type="button"
                className={`services-dot${activeService === i ? ' active' : ''}`}
                onClick={() => scrollToService(i)}
                aria-label={`Ver ${svc.title}`}
              />
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
              <span>Datos reales de mercado</span>
              <span>Respuesta en 24h</span>
            </div>
          </div>
          <div className="valuation-deco" aria-hidden="true">0€</div>
        </div>
        <div className="valuation-media" aria-hidden="true" />
      </section>

      <section className="section why">
        <div className="section-top">
          <SectionHeading eyebrow="Confianza" title="Por que elegirnos" />
        </div>
        <div className="why-slider">
          <button
            type="button"
            className="why-nav why-nav-prev"
            aria-label="Anterior"
            onClick={() => nextWhy(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <motion.article
            className="why-card"
            key={currentWhy.title}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <img src={currentWhy.image} alt="" />
            <div>
              <span>
                {whyIndex + 1} / {whyItems.length}
              </span>
              <h3>{currentWhy.title}</h3>
              <p>{currentWhy.description}</p>
            </div>
          </motion.article>
          <button
            type="button"
            className="why-nav why-nav-next"
            aria-label="Siguiente"
            onClick={() => nextWhy(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="why-dots" role="tablist" aria-label="Por que elegirnos">
          {whyItems.map((item, i) => (
            <button
              type="button"
              key={item.title}
              className={i === whyIndex ? 'why-dot active' : 'why-dot'}
              aria-label={`Ir a ${item.title}`}
              aria-selected={i === whyIndex}
              onClick={() => setWhyIndex(i)}
            />
          ))}
        </div>
        <div className="stats">
          <Stat value="+150" label="Operaciones" />
          <Stat value="98%" label="Satisfaccion" />
          <Stat value="45" label="Dias venta media" />
          <Stat value="+10" label="Anos experiencia" />
        </div>
      </section>

      <section className="access-blocks" ref={accessSectionRef}>
        {accessBlocks.map((item, i) => (
          <Link
            key={item.title}
            to={item.to}
            search={item.search}
            className={`access-block-item${activeAccessBlock === i ? ' is-active' : ''}`}
          >
            <div className="access-bg" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="access-desc">
              <p>{item.description}</p>
            </div>
            <h2 className="access-title">{item.title}</h2>
            <span className="access-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </section>

      <section className="section about-strip" id="nosotros">
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80" alt="" />
        <div>
          <blockquote>Porque comprendimos que el sector no necesitaba mas de lo mismo.</blockquote>
          <p>Una marca construida para cuidar cada detalle con excelencia, cercania y una forma de trabajar clara.</p>
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
          <div className="property-rail" ref={propertiesRef}>
            {displayedProperties.map((property) => (
              <article
                className="property-card"
                key={property.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate({ to: '/propiedades/$id', params: { id: String(property.id) } })}
              >
                <div className="property-image">
                  <img src={property.image} alt="" />
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
              </article>
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
