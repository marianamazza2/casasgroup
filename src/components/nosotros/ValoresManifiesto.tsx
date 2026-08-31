import { useState } from 'react'
import { motion } from 'framer-motion'
import { RevealTitle } from '../RevealTitle'
import { TextToggle } from '../TextToggle'

// "Nuestros valores": un único texto corrido, centrado, con la misma
// composición que la banda de marca de la home (.why-story): titular en serif
// dorado y párrafos sueltos debajo, sin listas ni etiquetas. La separación
// entre párrafos es solo aire de lectura: el texto es continuo.
// En mobile el texto es largo, así que se deja visible el primer párrafo y el
// resto se despliega con "Ver más" (el colapso lo hace el CSS: en desktop el
// texto siempre se ve entero y el botón no existe visualmente).
export function ValoresManifiesto({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="section valores">
      <div className="valores-story">
        {/* Mismo titular que el wordmark de la home: entra desenfocado, se
            enfoca y despues vira de champan a dorado. */}
        <RevealTitle as="h2" text="Nuestros valores" className="valores-title" />
        <motion.div
          className="nosotros-gold-line"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            id="valores-text"
            className={`valores-text${expanded ? ' is-expanded' : ' is-collapsed'}`}
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <TextToggle
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            controls="valores-text"
            className="valores-toggle"
          />
        </motion.div>
      </div>
    </section>
  )
}
