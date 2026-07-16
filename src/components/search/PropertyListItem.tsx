import { Link } from '@tanstack/react-router'
import type { Property } from '../../lib/types'

type Props = {
  property: Property
  id?: string
}

export function PropertyListItem({ property: p, id }: Props) {
  return (
    <Link
      to="/propiedades/$id"
      params={{ id: String(p.id) }}
      className="property-card-link"
    >
      <article id={id} className="property-card-list">
        <div className="property-card-img">
          {p.image && (
            <img
              src={p.image}
              alt={`${p.title} en ${p.zone}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          {p.tag && <span className="property-tag">{p.tag}</span>}
        </div>
        <div className="property-card-body">
          <div className="property-list-top">
            <span className="property-zone">{p.zone}</span>
          </div>
          <h3 className="property-title">{p.title}</h3>
          <div className="property-specs">
            {p.beds > 0 && <span>{p.beds} hab</span>}
            {p.baths > 0 && <span>{p.baths} ba</span>}
            <span>{p.m2} m²</span>
            {p.floor && <span>{p.floor} planta</span>}
          </div>
          <p className="property-price">{p.priceLabel}</p>
        </div>
      </article>
    </Link>
  )
}
