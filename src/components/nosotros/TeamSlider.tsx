import { useCallback, useEffect, useRef, useState } from 'react'

type Member = {
  name: string
  role: string
  image: string
}

const MOBILE_QUERY = '(max-width: 767px)'

/**
 * Equipo como slider horizontal en todos los tamaños. La pista arranca siempre
 * en scrollLeft 0, así que la primera vista es la que manda: en mobile se
 * respeta el orden del array (Angie primera) y en desktop se intercambian las
 * dos primeras fichas para que Angie quede en el centro de la fila.
 *
 * Las páginas no se calculan a partir de cuántas fichas caben (eso lo decide el
 * CSS con --team-per-view), sino midiendo la pista: scrollWidth / clientWidth.
 * Así el componente no tiene que conocer los breakpoints del ancho de ficha.
 */
export function TeamSlider({ members }: { members: Member[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)
  // Arrancamos en desktop para que la vista ancha no parpadee al hidratar.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // En desktop Angie va al centro de la primera vista de tres, no a la
  // izquierda; en mobile, donde solo se ve una ficha, sigue siendo la primera.
  const ordered =
    isMobile || members.length < 2
      ? members
      : [members[1], members[0], ...members.slice(2)]

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)))
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, ordered.length])

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (next: number) => {
    const el = trackRef.current
    if (!el) return
    const target = Math.min(pages - 1, Math.max(0, next))
    el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="team-slider">
      <div className="team-track" ref={trackRef} onScroll={onScroll}>
        {ordered.map((member, i) => (
          <article className="team-card" key={`${member.name}-${i}`}>
            <div
              className="team-photo"
              style={{ backgroundImage: `url(${member.image})` }}
              role="img"
              aria-label={member.name}
            />
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="team-nav">
          <button
            type="button"
            className="team-arrow team-arrow--prev"
            aria-label="Ver miembros anteriores"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
          >
            <span className="team-arrow-chevron" aria-hidden="true" />
          </button>

          <div className="team-dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`team-dot${i === page ? ' is-active' : ''}`}
                aria-label={`Ir al grupo ${i + 1}`}
                aria-current={i === page}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="team-arrow team-arrow--next"
            aria-label="Ver más miembros"
            disabled={page === pages - 1}
            onClick={() => goTo(page + 1)}
          >
            <span className="team-arrow-chevron" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
