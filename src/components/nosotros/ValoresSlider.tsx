import { useState } from 'react'

type Value = {
  title: string
  desc: string
}

export function ValoresSlider({ values }: { values: Value[] }) {
  const [activeValue, setActiveValue] = useState(0)

  const goPrev = () => setActiveValue((v) => (v > 0 ? v - 1 : values.length - 1))
  const goNext = () => setActiveValue((v) => (v < values.length - 1 ? v + 1 : 0))

  return (
    <section className="section valores">
      <div className="valores-header">
        <div className="section-heading">
          <h2>Nuestros valores</h2>
        </div>
        <div className="valores-arrows">
          <button type="button" aria-label="Valor anterior" onClick={goPrev}>
            ←
          </button>
          <button type="button" aria-label="Valor siguiente" onClick={goNext}>
            →
          </button>
        </div>
      </div>
      <div className="valores-panel">
        <div className="valores-list">
          {values.map((value, i) => (
            <button
              key={value.title}
              type="button"
              className={`valores-item${activeValue === i ? ' valores-item--active' : ''}`}
              onClick={() => setActiveValue(i)}
            >
              <span className="valores-item-num">0{i + 1}</span>
              <span className="valores-item-title">{value.title}</span>
            </button>
          ))}
        </div>
        <div className="valores-detail">
          <div className="valores-detail-text">
            <span className="valores-detail-num">0{activeValue + 1}</span>
            <h3>{values[activeValue].title}</h3>
            <p>{values[activeValue].desc}</p>
          </div>
          <div className="valores-photo">Foto valor</div>
        </div>
      </div>
    </section>
  )
}
