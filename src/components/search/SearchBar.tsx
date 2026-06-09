import type { FilterState } from '../../lib/types'

interface SearchBarProps {
  mode: FilterState['mode']
  query: FilterState['query']
  onModeChange: (mode: FilterState['mode']) => void
  onQueryChange: (query: string) => void
}

export function SearchBar({ mode, query, onModeChange, onQueryChange }: SearchBarProps) {
  return (
    <div className="search-topbar">
      <div className="mode-pills">
        {(['compra', 'alquiler'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`mode-pill${mode === m ? ' active' : ''}`}
            onClick={() => onModeChange(m)}
          >
            {m === 'compra' ? 'Compra' : 'Alquiler'}
          </button>
        ))}
      </div>
      <div className="search-input-wrap">
        <input
          className="search-input"
          type="text"
          placeholder="Ciudad, barrio, zona..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <button type="button" className="search-btn" aria-label="Buscar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
    </div>
  )
}
