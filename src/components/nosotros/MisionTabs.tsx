import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion'

type Tab = {
  label: string
  content: string
}

const ease = [0.22, 1, 0.36, 1] as const

export function MisionTabs({ tabs }: { tabs: Tab[] }) {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  // Mismo recorrido que "Te acompañamos en cada paso": la sección se fija y el
  // scroll avanza de una pestaña a la siguiente; al terminar se libera.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })

  // Solo pinneamos en pantallas anchas; en móvil quedan tabs clicables.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setPinned(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Relleno del número según el avance dentro del segmento de la pestaña actual.
  const fill = useMotionValue(0)
  const fillClip = useTransform(fill, (v) => `inset(${(1 - v) * 100}% 0 0 0)`)

  // Mapear el progreso de scroll a la pestaña activa (0 → 1 → 2) y al relleno.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return
    const scaled = p * tabs.length
    const idx = Math.min(tabs.length - 1, Math.max(0, Math.floor(scaled)))
    setActive(idx)
    fill.set(Math.min(1, Math.max(0, scaled - idx)))
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '10%'])

  const num = String(active + 1).padStart(2, '0')
  const total = String(tabs.length).padStart(2, '0')

  return (
    <section
      className="mision-feature"
      ref={wrapRef}
      style={pinned ? { height: `${tabs.length * 100}vh` } : undefined}
    >
      <div className={`mision-sticky${pinned ? ' is-pinned' : ''}`}>
        <motion.div className="mision-feature-bg" style={{ y: bgY }} aria-hidden="true">
          <div
            className="mision-feature-img"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80)',
            }}
          />
        </motion.div>
        <div className="mision-feature-overlay" aria-hidden="true" />

        <div className="mision-feature-inner">
          <span className="mision-eyebrow">Lo que nos mueve</span>

          {/* Número gigante en contorno, que rueda en vertical al cambiar */}
          <div className="mision-ghost" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.span
                key={active}
                className="mision-ghost-num"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-110%' }}
                transition={{ duration: 0.7, ease }}
              >
                <span className="mision-ghost-outline">{num}</span>
                <motion.span className="mision-ghost-fill" style={{ clipPath: fillClip }}>
                  {num}
                </motion.span>
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mision-tablist" role="tablist" aria-label="Misión, visión y propósito">
            {tabs.map((t, i) => {
              const isActive = i === active
              return (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`mision-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {t.label}
                  {isActive && (
                    <motion.span
                      className="mision-underline"
                      layoutId="mision-underline"
                      aria-hidden="true"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mision-text">
            <span className="mision-quote" aria-hidden="true">
              “
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                className="mision-content"
                initial={{ clipPath: 'inset(0 0 100% 0)', y: 12 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease }}
              >
                {tabs[active].content}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mision-progress" aria-hidden="true">
            <span className="mision-progress-num">{num}</span>
            <span className="mision-progress-track">
              <motion.span
                className="mision-progress-fill"
                initial={{ scaleX: 1 / tabs.length }}
                animate={{ scaleX: (active + 1) / tabs.length }}
                transition={{ duration: 0.5, ease }}
              />
            </span>
            <span className="mision-progress-total">{total}</span>
          </div>

          {/* En móvil, los dots reemplazan la barra 01–03 e indican que se
              puede cambiar de pestaña. */}
          <div className="mision-dots" role="tablist" aria-label="Cambiar de pestaña">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={t.label}
                className={`mision-dot${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
