import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

type Value = {
  title: string
  desc: string
  image: string
}

// Sección "Nuestros valores" con scroll pinned: la sección se fija a pantalla
// completa y, a medida que el usuario hace scroll vertical, avanza del 01 al 02,
// 02 al 03 y 03 al 04. Sólo cuando llega al último valor se libera y continúa
// hacia la siguiente sección. En móvil (sin pin) cae a un listado apilado.
// Scroll (en viewports) que hay que recorrer para pasar de un valor al
// siguiente. Menos que 1 viewport hace que el contenido del siguiente valor
// aparezca antes, sin obligar a scrollear una pantalla entera por valor.
const SCROLL_PER_VALUE = 0.55

export function ValoresSlider({ values }: { values: Value[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return
    const idx = Math.floor(p * values.length)
    setActive(Math.max(0, Math.min(values.length - 1, idx)))
  })

  // En móvil el escenario es un slider horizontal: el valor activo se deduce
  // de la posición de scroll y los dots permiten saltar a cada uno.
  const onStageScroll = () => {
    if (pinned) return
    const el = stageRef.current
    if (!el || el.clientWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActive(Math.max(0, Math.min(values.length - 1, idx)))
  }

  const goTo = (i: number) => {
    const el = stageRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setPinned(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section
      className="valores"
      ref={wrapRef}
      style={
        pinned
          ? { height: `calc(100svh + 100svh * ${SCROLL_PER_VALUE} * ${values.length})` }
          : undefined
      }
    >
      <div className={`valores-sticky${pinned ? ' is-pinned' : ''}`}>
        <div className="valores-header">
          <div className="section-heading">
            <h2>Nuestros valores</h2>
          </div>
          <div className="valores-progress" aria-hidden="true">
            {values.map((value, i) => (
              <span
                key={value.title}
                className={`valores-progress-dot${
                  i === active ? ' is-active' : i < active ? ' is-done' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="valores-panel">
          <div className="valores-list">
            {values.map((value, i) => (
              <div
                key={value.title}
                className={`valores-item${active === i ? ' valores-item--active' : ''}`}
              >
                <span className="valores-item-num">0{i + 1}</span>
                <span className="valores-item-title">{value.title}</span>
                <span className="valores-item-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            ))}
          </div>

          <div className="valores-stage" ref={stageRef} onScroll={onStageScroll}>
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="valores-slide"
                animate={{ opacity: pinned ? (active === i ? 1 : 0) : 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="valores-detail-text">
                  <span className="valores-detail-num">0{i + 1}</span>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
                <div
                  className="valores-photo"
                  style={{ backgroundImage: `url(${value.image})` }}
                  role="img"
                  aria-label={value.title}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="valores-dots" role="tablist" aria-label="Valores">
          {values.map((value, i) => (
            <button
              key={value.title}
              type="button"
              className={`valores-dot${active === i ? ' is-active' : ''}`}
              aria-label={`Ver ${value.title}`}
              aria-selected={active === i}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
