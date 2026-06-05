import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

type HeroTab = 'comprar' | 'alquilar' | 'vender' | 'reformas' | 'hipotecas'

const services = [
  {
    icon: 'AD',
    title: 'Administracion de fincas',
    description: 'Gestion integral de comunidades con transparencia y seguimiento cercano.',
  },
  {
    icon: 'HI',
    title: 'Hipotecas',
    description: 'Te ayudamos a encontrar la financiacion que encaja con tu compra.',
  },
  {
    icon: 'SU',
    title: 'Cambio de suministros',
    description: 'Luz, gas, agua y gestiones del cambio de vivienda resueltas por ti.',
  },
  {
    icon: 'SE',
    title: 'Seguros',
    description: 'Proteccion para vivienda, propietario e inquilino desde el primer dia.',
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

const featuredProperties = [
  {
    zone: 'Esplugues',
    title: 'Piso reformado con terraza',
    beds: 3,
    baths: 2,
    size: 95,
    price: '285.000 EUR',
    tag: 'Nuevo',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  },
  {
    zone: 'Sant Just Desvern',
    title: 'Casa adosada con jardin',
    beds: 4,
    baths: 2,
    size: 180,
    price: '520.000 EUR',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  },
  {
    zone: 'Cornella',
    title: 'Atico con vistas panoramicas',
    beds: 2,
    baths: 1,
    size: 72,
    price: '320.000 EUR',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
  },
  {
    zone: 'Sant Joan Despi',
    title: 'Duplex con terraza y parking',
    beds: 4,
    baths: 2,
    size: 130,
    price: '480.000 EUR',
    tag: 'Destacado',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  },
]

const accessBlocks = [
  {
    title: 'Comprar',
    description: 'Encuentra tu proximo hogar entre una seleccion cuidada de inmuebles.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Alquilar',
    description: 'Pisos y casas listos para entrar a vivir con una gestion agil.',
    image:
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Vender',
    description: 'Descubre el valor real de tu vivienda con una valoracion profesional.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
  },
]

function Home() {
  const [heroTab, setHeroTab] = useState<HeroTab>('comprar')
  const [propertyMode, setPropertyMode] = useState<'Venta' | 'Alquiler'>('Venta')
  const [whyIndex, setWhyIndex] = useState(0)
  const propertiesRef = useRef<HTMLDivElement>(null)

  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const heroMediaRef = useRef<HTMLDivElement>(null)
  const heroFillRef = useRef<HTMLDivElement>(null)
  const heroUiRef = useRef<HTMLDivElement>(null)
  const accessSectionRef = useRef<HTMLElement>(null)
  const [activeAccessBlock, setActiveAccessBlock] = useState<number | null>(null)

  useEffect(() => {
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

      // Phase 1 (0–35%): White luminous bg fades in, image fades out
      const bgT = phase(p, 0, 0.35)
      if (heroMediaRef.current) heroMediaRef.current.style.opacity = String(1 - bgT)
      if (heroBgRef.current) heroBgRef.current.style.opacity = String(bgT)

      // Phase 2 (28–65%): Letters fill in (outline → solid gold)
      const fillT = phase(p, 0.28, 0.65)
      if (heroFillRef.current) heroFillRef.current.style.opacity = String(fillT)

      // Phase 3 (44–78%): Tagline + tabs + search fade in
      const uiT = phase(p, 0.44, 0.78)
      if (heroUiRef.current) {
        heroUiRef.current.style.opacity = String(uiT)
        heroUiRef.current.style.transform = `translateY(${(1 - uiT) * 14}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const currentWhy = whyItems[whyIndex]
  const isSearchTab = heroTab === 'comprar' || heroTab === 'alquilar'

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nextWhy = (direction: -1 | 1) => {
    setWhyIndex((current) => (current + direction + whyItems.length) % whyItems.length)
  }

  const scrollProperties = (direction: -1 | 1) => {
    propertiesRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  return (
    <main className="home-page">
      <header className="site-nav">
        <button className="logo logo-small" type="button" onClick={() => scrollTo('inicio')}>
          <span>CASAS</span>
          <small>GROUP</small>
        </button>
        <nav aria-label="Navegacion principal">
          <button type="button" onClick={() => scrollTo('propiedades')}>
            Comprar
          </button>
          <button type="button" onClick={() => scrollTo('propiedades')}>
            Alquilar
          </button>
          <button type="button" onClick={() => scrollTo('valoracion')}>
            Vender
          </button>
          <button type="button" onClick={() => scrollTo('nosotros')}>
            Nosotros
          </button>
          <button type="button" onClick={() => scrollTo('servicios')}>
            Servicios
          </button>
          <Link to="/contacto">
            Contacto
          </Link>
        </nav>
      </header>

      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <section className="hero" id="inicio">
          {/* Layer 1: White luminous water background */}
          <div className="hero-white-bg" ref={heroBgRef} />

          {/* Layer 2: Property image */}
          <div className="hero-media" ref={heroMediaRef} />

          {/* Layer 3 + 4: All hero content stacked */}
          <div className="hero-content">
            {/* CASAS GROUP brand — visible from start, fills in on scroll */}
            <div className="hero-brand" aria-label="Casas Group">
              {/* Outline: image shows through the letters */}
              <div className="hero-brand-outline">
                <span className="hero-brand-casas">CASAS</span>
                <span className="hero-brand-group">GROUP</span>
              </div>
              {/* Fill: solid gold, fades in as you scroll */}
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
                    <input
                      className="hero-search-input"
                      aria-label="Buscar ubicacion"
                      placeholder={heroCopy[heroTab].line}
                    />
                  )}
                  {heroTab === 'vender' ? (
                    <button type="button" onClick={() => scrollTo('valoracion')}>
                      {heroCopy[heroTab].action}
                    </button>
                  ) : isSearchTab ? (
                    <button type="button">{heroCopy[heroTab].action}</button>
                  ) : (
                    <Link className="button-link" to="/contacto">
                      {heroCopy[heroTab].action}
                    </Link>
                  )}
                </div>
                {isSearchTab && (
                  <div className="direct-contact">
                    Prefiero hablar con alguien <Link to="/contacto">Contactar</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll hint — fixed to hero, always visible */}
          <div className="hero-scroll-hint" aria-hidden="true">
            <span>Descubrir</span>
            <div className="scroll-arrow" />
          </div>
        </section>
      </div>

      <section className="section services" id="servicios">
        <SectionHeading eyebrow="Servicios" title="Nuestros servicios" subtitle="Todo lo que necesitas en un solo lugar." />
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="valuation" id="valoracion">
        <div>
          <SectionHeading eyebrow="Valoracion" title="Valoracion gratuita" />
          <p>Valoracion profesional, gratuita y sin compromiso, basada en datos reales de tu zona.</p>
          <Link className="button-link" to="/contacto">
            Solicitar valoracion
          </Link>
        </div>
        <div className="valuation-media" aria-hidden="true" />
      </section>

      <section className="section why">
        <div className="section-top">
          <SectionHeading eyebrow="Confianza" title="Por que elegirnos" />
          <div className="round-actions">
            <button type="button" aria-label="Anterior" onClick={() => nextWhy(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" aria-label="Siguiente" onClick={() => nextWhy(1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
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
        <div className="stats">
          <Stat value="+150" label="Operaciones" />
          <Stat value="98%" label="Satisfaccion" />
          <Stat value="45" label="Dias venta media" />
          <Stat value="+10" label="Anos experiencia" />
        </div>
      </section>

      <section className="access-blocks" ref={accessSectionRef}>
        {accessBlocks.map((item, i) => (
          <article
            key={item.title}
            className={`access-block-item${activeAccessBlock === i ? ' is-active' : ''}`}
          >
            <div className="access-bg" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="access-desc">
              <p>{item.description}</p>
            </div>
            <h2 className="access-title">{item.title}</h2>
            <span className="access-arrow" aria-hidden="true">→</span>
          </article>
        ))}
      </section>

      <section className="section about-strip" id="nosotros">
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80" alt="" />
        <div>
          <SectionHeading eyebrow="Casas Group" title="Una inmobiliaria pensada para superar expectativas" />
          <blockquote>Porque entendimos que el sector no necesitaba mas de lo mismo.</blockquote>
          <p>Una marca construida para cuidar cada detalle con excelencia, cercania y una forma de trabajar clara.</p>
          <Link className="button-link" to="/contacto">
            Conocenos
          </Link>
        </div>
      </section>

      <section className="section properties" id="propiedades">
        <div className="section-top properties-top">
          <SectionHeading eyebrow="Inmuebles" title="Propiedades" subtitle="Seleccion de inmuebles disponibles." />
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
            <div className="round-actions">
              <button type="button" aria-label="Propiedad anterior" onClick={() => scrollProperties(-1)}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" aria-label="Propiedad siguiente" onClick={() => scrollProperties(1)}>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="property-rail" ref={propertiesRef}>
          {featuredProperties.map((property) => (
            <article className="property-card" key={property.title}>
              <div className="property-image">
                <img src={property.image} alt="" />
                {property.tag ? <span>{property.tag}</span> : null}
              </div>
              <div className="property-body">
                <small>{property.zone}</small>
                <h3>{property.title}</h3>
                <p>
                  {property.beds} hab · {property.baths} banos · {property.size} m2
                </p>
                <strong>{property.price}</strong>
              </div>
            </article>
          ))}
        </div>
        <button className="text-link" type="button">
          Ver todas las propiedades
        </button>
      </section>

      <footer className="footer" id="contacto">
        <div>
          <div className="logo footer-logo">
            <span>CASAS</span>
            <small>GROUP</small>
          </div>
          <p>Tu hogar empieza aqui.</p>
        </div>
        <div>
          <h3>Inmuebles</h3>
          <button type="button" onClick={() => scrollTo('propiedades')}>Comprar</button>
          <button type="button" onClick={() => scrollTo('propiedades')}>Alquilar</button>
          <button type="button" onClick={() => scrollTo('valoracion')}>Vender</button>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="mailto:info@casasgroup.es">info@casasgroup.es</a>
          <a href="tel:+34123456789">+34 123 456 789</a>
          <span>Esplugues de Llobregat</span>
        </div>
      </footer>
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
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
