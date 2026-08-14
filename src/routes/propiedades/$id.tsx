import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { CSSProperties } from 'react'
import { properties } from '../../lib/properties'
import type { Property } from '../../lib/types'
import { isValidCoords } from '../../lib/coords'
import { gallerySrcSet, withTransform } from '../../lib/cloudinary'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { PropertyMap } from '../../components/property/PropertyMap'
import { JsonLd } from '../../components/JsonLd'
import { Seo } from '../../components/Seo'
import { absoluteUrl, breadcrumbSchema, realEstateListingSchema } from '../../lib/structuredData'

export const Route = createFileRoute('/propiedades/$id')({
  component: PropertyDetailPage,
})

function PropertyDetailPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const p = properties.find((x) => x.id === Number(id))

  // Boton flotante de volver (mobile, estilo Airbnb): vuelve a la pantalla
  // anterior real; si se entro por un link directo (sin historial en el sitio)
  // cae en la busqueda para no salir de la web.
  const goBack = () => {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      router.navigate({ to: '/propiedades', search: { query: '', mode: 'compra' } })
    }
  }

  if (!p) {
    return (
      <div className="detail-notfound">
        <Seo title="Propiedad no encontrada | Group Casas" noindex />
        <p>Propiedad no encontrada.</p>
        <Link to="/propiedades" search={{ query: '', mode: 'compra' }}>← Volver a búsqueda</Link>
      </div>
    )
  }

  const propertyRef = `GC-${String(p.id).padStart(4, '0')}`
  const locality = p.zone || p.city
  const canonical = absoluteUrl(`/propiedades/${p.id}`)
  // title/description desde los datos del inmueble (§4.3.2); OG con la foto de
  // portada (p.image = cover) — clave para la miniatura al compartir por WhatsApp.
  const seoTitle = `${p.title} en ${locality} | Group Casas`
  const seoDescription = `${p.title} en ${locality}. ${p.priceLabel} · ${p.m2} m² · ${p.beds} hab. Descúbrelo y agenda tu visita con Group Casas.`

  return (
    <article className="property-detail">
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        image={p.image}
        url={canonical}
      />
      <JsonLd data={realEstateListingSchema(p)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Propiedades', path: '/propiedades' },
          { name: p.title, path: `/propiedades/${p.id}` },
        ])}
      />
      <button
        type="button"
        className="detail-back-fab"
        onClick={goBack}
        aria-label="Volver"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <PhotoGallery images={p.images ?? [p.image]} title={p.title} />

      <div className="detail-content">
        <div className="detail-main">
          <PropertyMeta property={p} propertyRef={propertyRef} />
          <PropertyStats property={p} />
          <PropertyEssentials property={p} />
          <PropertyDescription desc={p.desc} />
          <PropertyFeatures features={p.features} />
          <LocationSection property={p} />
        </div>
      </div>

      {/* Barra fija de contacto (solo mobile, estilo Airbnb): un unico CTA que
          lleva a /contacto pasando el id del inmueble, para prellenar el mensaje
          con su titulo. */}
      <div className="detail-cta-bar">
        <span className="detail-cta-price">{p.priceLabel}</span>
        <Link
          to="/contacto"
          search={{ inmueble: p.id }}
          className="detail-cta-btn"
        >
          Contactar
        </Link>
      </div>
    </article>
  )
}

/** Fondo LQIP: miniatura desenfocada (~1 KB) bajo la foto grande, para que el
 *  hueco no se vea vacío mientras baja. */
const lqip = (src: string): CSSProperties => ({
  backgroundImage: `url("${withTransform(src, 'placeholder')}")`,
})

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  // Mismo breakpoint que el CSS (index.css §Gallery). Se monta un solo layout:
  // ver useMediaQuery para por qué no basta con display:none.
  const isMobile = useMediaQuery('(max-width: 768px)')

  const main = images[0]
  const thumbs = images.slice(1, 5)
  const slots = Array.from({ length: 4 }, (_, i) => thumbs[i] ?? null)

  const onCarouselScroll = () => {
    const el = carouselRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setCarouselIndex(i)
  }

  return (
    <>
      {/* Desktop / tablet grid */}
      {!isMobile && (
        <div className="detail-gallery">
          <div
            className="detail-photo detail-photo--main"
            style={lqip(main)}
            onClick={() => setLightboxIndex(0)}
          >
            {/* fetchPriority alto: es el LCP de la ficha y por defecto compite en
                igualdad con las miniaturas. */}
            <img
              src={main}
              srcSet={gallerySrcSet(main)}
              sizes="(max-width: 1180px) 50vw, 584px"
              alt={title}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          {slots.map((src, i) => {
            const isLast = i === 3
            return (
              <div
                key={i}
                className={`detail-photo${isLast ? ' detail-photo--last' : ''}${src ? ' detail-photo--clickable' : ''}`}
                style={src ? lqip(src) : undefined}
                onClick={() => src && setLightboxIndex(i + 1)}
              >
                {/* Miniaturas de ~285×230: pedir el derivado de 600px, no el de
                    1600px de la galería. */}
                {src && (
                  <img
                    src={withTransform(src, 'preview')}
                    alt={`${title} ${i + 2}`}
                    decoding="async"
                  />
                )}
                {isLast && (
                  <button
                    className="detail-gallery-btn"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(0) }}
                  >
                    <span className="detail-gallery-btn-grid">⊞</span>
                    Mostrar todas las fotos
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Mobile swipeable carousel */}
      {isMobile && (
        <div className="detail-carousel">
          <div className="detail-carousel-stage">
            <div
              className="detail-carousel-track"
              ref={carouselRef}
              onScroll={onCarouselScroll}
            >
              {images.map((src, i) => (
                <div key={i} className="detail-carousel-slide" style={lqip(src)}>
                  {/* La foto vecina se baja MIENTRAS mirás la actual. Con
                      loading="lazy" en todas menos la primera, cada swipe
                      arrancaba la descarga recién al llegar a la foto. */}
                  <img
                    src={src}
                    srcSet={gallerySrcSet(src)}
                    sizes="100vw"
                    alt={`${title} ${i + 1}`}
                    loading={Math.abs(i - carouselIndex) <= 1 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div
                className="detail-carousel-count"
                role="status"
                aria-live="polite"
                aria-label={`Foto ${carouselIndex + 1} de ${images.length}`}
              >
                {carouselIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

function Lightbox({
  images,
  initialIndex,
  title,
  onClose,
}: {
  images: string[]
  initialIndex: number
  title: string
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)
  const total = images.length

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  // Solo la foto actual está en el DOM, así que cada flecha desmontaba una <img>
  // y montaba otra: descarga desde cero. Precargar las vecinas las deja en caché
  // del navegador antes de que hagan falta.
  useEffect(() => {
    if (total < 2) return
    for (const i of [(current + 1) % total, (current - 1 + total) % total]) {
      const img = new Image()
      img.src = images[i]
    }
  }, [current, total, images])

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>

      <button
        className="lightbox-arrow lightbox-arrow--prev"
        onClick={(e) => { e.stopPropagation(); prev() }}
      >
        ‹
      </button>

      <div
        className="lightbox-img-wrap"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[current]}
          srcSet={gallerySrcSet(images[current])}
          sizes="100vw"
          alt={`${title} ${current + 1}`}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <button
        className="lightbox-arrow lightbox-arrow--next"
        onClick={(e) => { e.stopPropagation(); next() }}
      >
        ›
      </button>

      <div className="lightbox-counter">{current + 1} / {total}</div>

      <div className="lightbox-thumbs" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <button
            key={i}
            className={`lightbox-thumb${i === current ? ' lightbox-thumb--active' : ''}`}
            onClick={() => setCurrent(i)}
          >
            {/* 64×48 en pantalla: el derivado de 200px sobra. Antes se bajaba el
                de 1600px de la galería, uno por foto del inmueble. */}
            <img
              src={withTransform(src, 'thumbnail')}
              alt={`${title} ${i + 1}`}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const ESTADO_LABEL: Record<string, string> = {
  'EN VENTA': 'En venta',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
  ALQUILADO: 'Alquilado',
}
const CATEGORY_LABEL: Record<Property['category'], string> = {
  piso: 'Piso',
  chalet: 'Chalet',
  local: 'Local',
  parking: 'Parking',
}
const formatInt = (n: number) => new Intl.NumberFormat('es-ES').format(n)

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
/** Fecha ISO → fecha legible ("15 mar 2026"). UTC para no correr el día por zona horaria. */
function formatDate(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getUTCDate()} ${MONTHS_ES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function PropertyMeta({ property: p, propertyRef }: { property: Property; propertyRef: string }) {
  const location = [p.zone, p.city].filter(Boolean).join(' · ').toUpperCase()
  return (
    <div className="detail-meta">
      <div className="detail-zone-ref-row">
        <p className="detail-zone-ref">
          {location} · Ref. {propertyRef}
        </p>
        {p.status && (
          <span className={`detail-status detail-status--${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {ESTADO_LABEL[p.status] ?? p.status}
          </span>
        )}
      </div>
      <div className="detail-meta-head">
        <div className="detail-meta-left">
          <h1 className="detail-title">{p.title}</h1>
          <p className="detail-price">{p.priceLabel}</p>
        </div>
        <div className="detail-meta-aside">
          <Link to="/contacto" search={{ inmueble: p.id }} className="button-link">
            Contactar →
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Bloque "Lo esencial": tipo, precio/m², certificado energético y fecha de alta.
 *  Mismo estilo que la fila de stats (valor grande arriba, etiqueta abajo). */
function PropertyEssentials({ property: p }: { property: Property }) {
  const fecha = p.dateAdded ? formatDate(p.dateAdded) : null
  const pricePerM2 = p.m2 > 0 ? Math.round(p.price / p.m2) : null
  const cells: Array<{ value: string; label: string }> = [
    { value: CATEGORY_LABEL[p.category], label: 'Tipo' },
  ]
  if (pricePerM2 !== null) cells.push({ value: `${formatInt(pricePerM2)} €/m²`, label: 'Precio/m²' })
  if (p.cert) cells.push({ value: p.cert, label: 'Certificado energético' })
  if (fecha) cells.push({ value: fecha, label: 'Publicado' })
  return (
    <div className="detail-stats detail-stats--secondary">
      {cells.map((c) => (
        <div key={c.label}>
          <p className="detail-stat-value">{c.value}</p>
          <p className="detail-stat-label">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

function PropertyStats({ property: p }: { property: Property }) {
  return (
    <div className="detail-stats">
      <div>
        <p className="detail-stat-value">{p.beds}</p>
        <p className="detail-stat-label">Dormitorios</p>
      </div>
      <div>
        <p className="detail-stat-value">{p.baths}</p>
        <p className="detail-stat-label">Baños</p>
      </div>
      <div>
        <p className="detail-stat-value">{p.m2} m²</p>
        <p className="detail-stat-label">Superficie</p>
      </div>
      {p.floor && (
        <div>
          <p className="detail-stat-value">{p.floor}</p>
          <p className="detail-stat-label">Planta</p>
        </div>
      )}
    </div>
  )
}

function PropertyDescription({ desc }: { desc: string }) {
  const [expanded, setExpanded] = useState(false)
  const [clampable, setClampable] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const check = () => {
      // Solo aplica en mobile (clamp activo por CSS). Detecta si el texto
      // colapsado desborda su altura máxima.
      const overflows = el.scrollHeight - el.clientHeight > 4
      setClampable(overflows && !expanded)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [desc, expanded])

  return (
    <section className="detail-description">
      <h2 className="detail-section-title">Descripción</h2>
      <p ref={textRef} className={expanded ? 'is-expanded' : 'is-clamped'}>
        {desc}
      </p>
      {(clampable || expanded) && (
        <button
          type="button"
          className="detail-description-toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </section>
  )
}

function PropertyFeatures({ features }: { features: string[] }) {
  if (!features.length) return null
  return (
    <section className="detail-features-section">
      <h2 className="detail-section-title">Características</h2>
      <div className="detail-features">
        {features.map((f) => (
          <span key={f} className="detail-feature-pill">
            {f}
          </span>
        ))}
      </div>
    </section>
  )
}

function LocationSection({ property: p }: { property: Property }) {
  return (
    <section className="detail-map-section">
      <h2 className="detail-section-title">Ubicación</h2>
      {/* `isValidCoords` y no `p.coords`: una coordenada corrupta hace que
          MapLibre lance y tumbe el render de la ficha entera (no solo el mapa). */}
      {isValidCoords(p.coords) ? (
        <PropertyMap coords={p.coords} />
      ) : (
        <div className="detail-map-placeholder">Ubicación no disponible</div>
      )}
    </section>
  )
}
