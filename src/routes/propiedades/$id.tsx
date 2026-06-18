import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import { properties } from '../../lib/propertiesData'
import type { Property } from '../../lib/types'
import { ContactCard } from '../../components/property/ContactCard'
import { PropertyMap } from '../../components/property/PropertyMap'

export const Route = createFileRoute('/propiedades/$id')({
  component: PropertyDetailPage,
})

function PropertyDetailPage() {
  const { id } = Route.useParams()
  const p = properties.find((x) => x.id === Number(id))

  if (!p) {
    return (
      <div className="detail-notfound">
        <p>Propiedad no encontrada.</p>
        <Link to="/propiedades" search={{ query: '', mode: 'compra' }}>← Volver a búsqueda</Link>
      </div>
    )
  }

  const propertyRef = `CG-${String(p.id).padStart(4, '0')}`

  return (
    <div className="property-detail">
      <Link to="/propiedades" search={{ query: '', mode: 'compra' }} className="detail-back">
        ← Volver a búsqueda
      </Link>

      <PhotoGallery images={p.images ?? [p.image]} title={p.title} />

      <div className="detail-content">
        <div className="detail-main">
          <PropertyMeta property={p} propertyRef={propertyRef} />
          <PropertyStats property={p} />
          <PropertyDescription desc={p.desc} />
          <PropertyFeatures features={p.features} />
          <LocationSection property={p} />
        </div>
        <aside className="detail-sidebar">
          <ContactCard propertyRef={propertyRef} />
        </aside>
      </div>
    </div>
  )
}

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

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
      <div className="detail-gallery">
        <div
          className="detail-photo detail-photo--main"
          onClick={() => setLightboxIndex(0)}
        >
          <img src={main} alt={title} />
        </div>
        {slots.map((src, i) => {
          const isLast = i === 3
          return (
            <div
              key={i}
              className={`detail-photo${isLast ? ' detail-photo--last' : ''}${src ? ' detail-photo--clickable' : ''}`}
              onClick={() => src && setLightboxIndex(i + 1)}
            >
              {src && <img src={src} alt={`${title} ${i + 2}`} />}
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

      {/* Mobile swipeable carousel */}
      <div className="detail-carousel">
        <div
          className="detail-carousel-track"
          ref={carouselRef}
          onScroll={onCarouselScroll}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="detail-carousel-slide"
              onClick={() => setLightboxIndex(i)}
            >
              <img src={src} alt={`${title} ${i + 1}`} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="detail-carousel-counter">
            {carouselIndex + 1} / {images.length}
          </div>
        )}
        <button
          className="detail-carousel-btn"
          onClick={() => setLightboxIndex(0)}
        >
          <span className="detail-gallery-btn-grid">⊞</span>
          Mostrar todas las fotos
        </button>
      </div>

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
        <img src={images[current]} alt={`${title} ${current + 1}`} />
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
            <img src={src} alt={`${title} ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

function PropertyMeta({ property: p, propertyRef }: { property: Property; propertyRef: string }) {
  return (
    <div className="detail-meta">
      <p className="detail-zone-ref">
        {p.zone.toUpperCase()} · Ref. {propertyRef}
      </p>
      <h1 className="detail-title">{p.title}</h1>
      <p className="detail-price">{p.priceLabel}</p>
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
  return (
    <div className="detail-description">
      <h2 className="detail-section-title">Descripción</h2>
      <p>{desc}</p>
    </div>
  )
}

function PropertyFeatures({ features }: { features: string[] }) {
  if (!features.length) return null
  return (
    <div className="detail-features-section">
      <h2 className="detail-section-title">Características</h2>
      <div className="detail-features">
        {features.map((f) => (
          <span key={f} className="detail-feature-pill">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function LocationSection({ property: p }: { property: Property }) {
  return (
    <div className="detail-map-section">
      <h2 className="detail-section-title">Ubicación</h2>
      {p.coords ? (
        <PropertyMap coords={p.coords} title={p.title} />
      ) : (
        <div className="detail-map-placeholder">Ubicación no disponible</div>
      )}
    </div>
  )
}
