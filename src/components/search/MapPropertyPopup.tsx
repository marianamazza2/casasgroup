import type { Property } from '../../lib/types'

type Props = {
  property: Property
  onClose: () => void
}

export function MapPropertyPopup({ property: p, onClose }: Props) {
  return (
    <div className="map-popup" onClick={(e) => e.stopPropagation()}>
      <div className="map-popup-img">
        <img src={p.image} alt={p.title} />
        {p.tag && <span className="map-popup-tag">{p.tag}</span>}
        <button className="map-popup-close" onClick={onClose} aria-label="Cerrar">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="map-popup-body">
        <div className="map-popup-meta">
          <span className="map-popup-zone">{p.zone}</span>
          {p.mode === 'alquiler' && <span className="map-popup-mode">Alquiler</span>}
        </div>
        <p className="map-popup-title">{p.title}</p>
        <div className="map-popup-specs">
          {p.beds > 0 && <span>{p.beds} hab</span>}
          {p.baths > 0 && <span>{p.baths} ba</span>}
          <span>{p.m2} m²</span>
        </div>
        <p className="map-popup-price">{p.priceLabel}</p>
      </div>
    </div>
  )
}
