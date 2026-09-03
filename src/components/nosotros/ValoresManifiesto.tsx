import { useRef } from 'react'
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

/** Opacidad de la palabra todavía no "encendida". */
const DIM = 0.16
/** Cuántas palabras están encendiéndose a la vez (cola del barrido). */
const SPREAD = 7

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
  const textRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // El barrido va atado al recorrido del propio texto: empieza cuando su primera
  // línea entra por abajo y termina un poco antes de que su última línea salga
  // por arriba, para que nunca quede una palabra apagada en pantalla.
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.7'],
  })

  const paras = paragraphs.map(tokenize)
  const total = paras.reduce((n, tokens) => n + tokens.length, 0)
  const step = 1 / Math.max(1, total)
  let index = 0

  return (
    <section className="section valores">
      <div className="valores-inner">
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
    </section>
  )
}
