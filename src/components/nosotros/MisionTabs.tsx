import { useState } from 'react'

type Tab = {
  label: string
  content: string
}

export function MisionTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="mision-tabs">
      <div className="mision-tab-list" role="tablist" aria-label="Misión, visión y propósito">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            className={`mision-tab${activeTab === i ? ' mision-tab--active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="mision-content">{tabs[activeTab].content}</p>
    </section>
  )
}
