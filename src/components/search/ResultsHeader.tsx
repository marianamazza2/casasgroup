interface ResultsHeaderProps {
  count: number
  total?: number
  zone?: string
  isBoundsFiltered?: boolean
}

export function ResultsHeader({ count, total, zone, isBoundsFiltered }: ResultsHeaderProps) {
  const label = zone && zone !== 'Todas' ? `en ${zone}` : 'disponibles'

  return (
    <div className="results-header">
      <span className="results-count">
        <strong>{count}</strong>{' '}
        {isBoundsFiltered ? (
          <>inmuebles en el mapa <span className="results-total-hint">(de {total} {label})</span></>
        ) : (
          <>inmuebles {label}</>
        )}
      </span>
      <span className="results-sort">Más recientes</span>
    </div>
  )
}
