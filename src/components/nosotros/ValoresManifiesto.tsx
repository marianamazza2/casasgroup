import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { RevealTitle } from '../RevealTitle'

// "Nuestros valores": sigue siendo UN ÚNICO texto corrido (sin listas, ni
// tarjetas, ni etiquetas), pero deja de ser el bloque centrado que clonaba la
// banda de la home. Ahora es una composición editorial:
//
//   · asimétrica — titular fijo (sticky) a la izquierda y el texto a la derecha,
//   · con capitular dorada en la primera letra y una filigrana "GC" de fondo,
//   · y con el texto que se enciende palabra a palabra al hacer scroll
//     (de gris apagado a tinta), el mismo lenguaje del hero y del RevealTitle.
//
// Los cuatro valores se perciben sin romper el párrafo: cada uno lleva su
// expresión clave en dorado dentro del propio texto (ver VALORES_TEXTO, donde
// van marcadas entre asteriscos).
//
// Ya no hay "Ver más" en móvil: el texto se lee entero. Un botón de desplegar
// le dice al usuario "esto es demasiado largo"; el encendido al scroll le dice
// justo lo contrario.
//
// En desktop el bloque se pinea (mismo recorrido que MisionTabs): la sección
// mide varias pantallas y la composición se queda quieta mientras el scroll
// enciende las palabras. Así el texto nunca se mete por debajo de la navbar y
// el aire de arriba (padding del contenedor fijo) se mantiene constante. En
// móvil, o en pantallas bajas donde el texto no cabría de una, se vuelve al
// comportamiento en flujo de siempre.

/** Opacidad de la palabra todavía no "encendida". */
const DIM = 0.16
/** Cuántas palabras están encendiéndose a la vez (cola del barrido). */
const SPREAD = 7
/** Aire mínimo que tiene que sobrar debajo del bloque para permitir el pin. */
const BOTTOM_AIR = 40

type Token = { text: string; accent: boolean }

// Parte un párrafo en palabras, marcando las que van en dorado. Los tramos
// destacados se escriben en el copy entre asteriscos: *honestidad y transparencia*.
// Primero se limpian los asteriscos guardando el rango que ocupaban y despues se
// corta por palabras: asi la puntuacion pegada al tramo ("transparencia,") viaja
// con su palabra y no queda un espacio suelto antes de la coma.
function tokenize(paragraph: string): Token[] {
  const ranges: Array<[number, number]> = []
  let clean = ''
  let last = 0
  const marked = /\*([^*]+)\*/g
  let mark: RegExpExecArray | null
  while ((mark = marked.exec(paragraph))) {
    clean += paragraph.slice(last, mark.index)
    const start = clean.length
    clean += mark[1]
    ranges.push([start, clean.length])
    last = mark.index + mark[0].length
  }
  clean += paragraph.slice(last)

  const tokens: Token[] = []
  const words = /\S+/g
  let word: RegExpExecArray | null
  while ((word = words.exec(clean))) {
    const from = word.index
    const to = from + word[0].length
    tokens.push({
      text: word[0],
      accent: ranges.some(([a, b]) => from < b && to > a),
    })
  }
  return tokens
}

// Una palabra del barrido. Cada una tiene su propia ventana dentro del progreso
// de scroll del bloque, solapada con las vecinas para que el encendido se lea
// como una ola y no como un semáforo palabra por palabra.
function Word({
  token,
  progress,
  start,
  end,
}: {
  token: Token
  progress: MotionValue<number>
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [DIM, 1])

  return (
    <motion.span
      className={`valores-word${token.accent ? ' valores-accent' : ''}`}
      style={{ opacity }}
    >
      {token.text}{' '}
    </motion.span>
  )
}

export function ValoresManifiesto({ paragraphs }: { paragraphs: string[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [pinned, setPinned] = useState(false)

  // Solo pineamos si la composición entera cabe en una pantalla: si no cabe, el
  // contenedor fijo cortaría el final del texto. En vez de adivinarlo con una
  // media query de altura, se mide el bloque real (la maquetación es idéntica
  // pineada o en flujo, así que la medida vale en los dos estados).
  useEffect(() => {
    const check = () => {
      const inner = innerRef.current
      if (!inner || !window.matchMedia('(min-width: 901px)').matches) {
        setPinned(false)
        return
      }
      const nav = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      ) || 72
      // Mismos valores que .valores.is-pinned .valores-pin en el CSS.
      const padTop = Math.min(180, Math.max(64, window.innerHeight * 0.15))
      setPinned(inner.offsetHeight + BOTTOM_AIR <= window.innerHeight - nav - padTop)
    }
    check()
    // La serif del titular y del texto cambia la altura al cargar: se remide.
    document.fonts?.ready.then(check)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Pineado: el progreso lo marca el recorrido de la sección alta (0 cuando se
  // clava, 1 cuando se suelta). El barrido va de 0.06 a 0.82 para que arranque
  // un instante después de fijarse y termine antes de soltar el pin: así nunca
  // se libera con palabras todavía apagadas en pantalla.
  const pinnedScroll = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const pinnedProgress = useTransform(pinnedScroll.scrollYProgress, [0.06, 0.82], [0, 1], {
    clamp: true,
  })

  // En flujo el barrido va atado al recorrido del propio texto: empieza cuando su
  // primera línea entra por abajo y termina un poco antes de que su última línea
  // salga por arriba, para que nunca quede una palabra apagada en pantalla.
  const flowScroll = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.7'],
  })

  const scrollYProgress = pinned ? pinnedProgress : flowScroll.scrollYProgress

  const paras = paragraphs.map(tokenize)
  const total = paras.reduce((n, tokens) => n + tokens.length, 0)
  const step = 1 / Math.max(1, total)
  let index = 0

  return (
    <section
      className={`section valores${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      style={pinned ? { height: '220vh' } : undefined}
    >
      <div className="valores-pin">
        <div className="valores-inner" ref={innerRef}>
          <div className="valores-aside">
            {/* Filigrana de marca: la "GC" del isotipo, gigante y casi
                transparente, detrás del titular. */}
            <span className="valores-mark" aria-hidden="true">
              GC
            </span>
            {/* Mismo titular que el wordmark de la home: entra desenfocado, se
                enfoca y despues vira de champan a dorado. */}
            <RevealTitle as="h2" text="Nuestros valores" className="valores-title" />
            <motion.div
              className="nosotros-gold-line nosotros-gold-line--left"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="valores-text" ref={textRef}>
            {paras.map((tokens, i) => (
              <p key={paragraphs[i].slice(0, 40)}>
                {tokens.map((token) => {
                  const start = index * step
                  index += 1
                  return reduceMotion ? (
                    <span
                      key={`${token.text}-${index}`}
                      className={`valores-word${token.accent ? ' valores-accent' : ''}`}
                    >
                      {token.text}{' '}
                    </span>
                  ) : (
                    <Word
                      key={`${token.text}-${index}`}
                      token={token}
                      progress={scrollYProgress}
                      start={start}
                      end={Math.min(1, start + step * SPREAD)}
                    />
                  )
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
