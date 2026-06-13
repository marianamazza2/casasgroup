import { useState } from 'react'

type AccordionItem = {
  title: string
  desc: string
}

export function ServicioAccordion({ items }: { items: AccordionItem[] }) {
  const [openItem, setOpenItem] = useState(0)

  return (
    <section className="servicio-split">
      <div className="servicio-photo">Foto edificio / comunidad</div>
      <div className="servicio-accordion">
        <h2 className="servicio-accordion-title">Qué incluye nuestro servicio</h2>
        {items.map((item, i) => {
          const open = openItem === i
          return (
            <div
              key={item.title}
              className={`accordion-item${open ? ' accordion-item--open' : ''}`}
            >
              <button
                type="button"
                className="accordion-item-head"
                aria-expanded={open}
                onClick={() => setOpenItem(open ? -1 : i)}
              >
                <span className="accordion-item-label">
                  <span className="accordion-item-num">0{i + 1}</span>
                  <span className="accordion-item-title">{item.title}</span>
                </span>
                <span className="accordion-item-icon" aria-hidden="true">
                  +
                </span>
              </button>
              {open && <p className="accordion-item-desc">{item.desc}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
