import type { Property } from '../../lib/types'

type Props = {
  property: Property
  id?: string
  onClick?: (p: Property) => void
}

export function PropertyCard({ property: p, id, onClick }: Props) {
  return (
    <article id={id} className="property-card-grid" onClick={() => onClick?.(p)}>
      <div className="property-card-img" aria-hidden="true">
        {p.image && (
          <img
            src={p.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        {p.tag && <span className="property-tag">{p.tag}</span>}
      </div>
      <div className="property-card-body">
        <span className="property-zone">{p.zone}</span>
        <h3 className="property-title">{p.title}</h3>
        <div className="property-specs">
          {p.beds > 0 && <span>{p.beds} hab</span>}
          {p.baths > 0 && <span>{p.baths} ba</span>}
          <span>{p.m2} m²</span>
        </div>
        <p className="property-price">{p.priceLabel}</p>
      </div>
    </article>
  )
}
