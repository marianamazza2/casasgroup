import { useState, useEffect, useRef } from "react";

// Load Cormorant Garamond from Google Fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const dmSansLink = document.createElement("link");
dmSansLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap";
dmSansLink.rel = "stylesheet";
document.head.appendChild(dmSansLink);

const gold = "#a47b36";
const goldBg = "#F9F4EA";
const goldBgHover = "#EFE2CD";
const warmGray = "#F7F5F0";
const textPrimary = "#1A1A18";
const textSecondary = "#3D3D3A";
const textMuted = "#7A7A74";
const borderLight = "#E8E6DF";
const charcoal800 = "#2C2C2A";
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', 'Helvetica Neue', sans-serif";

function Logo({ size = "md", onClick }) {
  const sizes = { sm: { f: 13, s: 8, g: 1 }, md: { f: 16, s: 10, g: 2 }, lg: { f: 100, s: 14, g: -8 } };
  const s = sizes[size];
  if (size === "lg") {
    return (
      <div onClick={onClick} style={{ fontFamily: serif, textAlign: "center", cursor: onClick ? "pointer" : "default", display: "inline-block" }}>
        <div style={{ fontSize: s.f, letterSpacing: 24, fontWeight: 300, color: gold, lineHeight: 1 }}>CASAS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: s.g }}>
          <div style={{ flex: 1, height: 1, background: gold, opacity: 0.4 }} />
          <span style={{ fontSize: 40, letterSpacing: 12, color: gold, fontWeight: 300, whiteSpace: "nowrap" }}>GROUP</span>
          <div style={{ flex: 1, height: 1, background: gold, opacity: 0.4 }} />
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClick} style={{ fontFamily: serif, textAlign: "left", cursor: onClick ? "pointer" : "default", lineHeight: 1, display: "inline-block" }}>
      <div style={{ fontSize: s.f, letterSpacing: 5, fontWeight: 300, color: gold }}>CASAS</div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
        <div style={{ flex: 1, height: 0.5, background: gold, opacity: 0.4 }} />
        <span style={{ fontSize: s.s, letterSpacing: 3, color: gold, fontWeight: 300 }}>GROUP</span>
        <div style={{ flex: 1, height: 0.5, background: gold, opacity: 0.4 }} />
      </div>
    </div>
  );
}

function GoldLine({ width = 40, margin = "0 auto" }) {
  return <div style={{ width, height: 1, background: gold, margin, opacity: 0.4 }} />;
}

function SectionTitle({ children, sub, center }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: sub ? 8 : 16 }}>
      <div style={{ fontFamily: serif, fontSize: 40, letterSpacing: 0, fontWeight: 500, textTransform: "uppercase", color: gold }}>{children}</div>
      {sub && <p style={{ fontSize: 14, color: textSecondary, marginTop: 10, fontWeight: 400, letterSpacing: 0.2 }}>{sub}</p>}
    </div>
  );
}

function Navbar({ onHome, onContact }) {
  const [showServicios, setShowServicios] = useState(false);
  const scrollToServicios = () => {
    setShowServicios(false);
    const el = document.getElementById("mas-servicios");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "16px 32px", borderBottom: `0.5px solid ${borderLight}`, position: "relative", zIndex: 50 }}>
      <div style={{ position: "absolute", left: 32 }}><Logo size="sm" onClick={onHome} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 11, letterSpacing: 0.5 }}>
        {["Comprar", "Alquilar", "Vender", "Nosotros"].map(i => (
          <span key={i} style={{ color: textSecondary, cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = gold; }}
            onMouseLeave={e => { e.currentTarget.style.color = textSecondary; }}>{i}</span>
        ))}
        <div style={{ position: "relative" }}
          onMouseEnter={() => setShowServicios(true)}
          onMouseLeave={() => setShowServicios(false)}>
          <span style={{ color: showServicios ? gold : textSecondary, cursor: "pointer", fontWeight: showServicios ? 500 : 400, transition: "color 0.2s" }}>
            Servicios {showServicios ? "\u25B4" : "\u25BE"}
          </span>
          {showServicios && (
            <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 8, zIndex: 50 }}>
              <div style={{ background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", minWidth: 220, overflow: "hidden" }}>
                {["Administracion de fincas", "Hipotecas", "Cambio de suministros", "Seguros"].map((s, i) => (
                  <div key={s} onClick={scrollToServicios} style={{ padding: "12px 18px", fontSize: 12, color: textSecondary, cursor: "pointer", borderBottom: i < 3 ? `0.5px solid ${borderLight}` : "none", transition: "color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = gold; }}
                    onMouseLeave={e => { e.currentTarget.style.color = textSecondary; }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <span onClick={onContact} style={{ color: textSecondary, cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = gold; }}
          onMouseLeave={e => { e.currentTarget.style.color = textSecondary; }}>Contacto</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ padding: "48px 36px 32px", background: charcoal800, color: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: serif, lineHeight: 1.2, marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>GROUP</div>
            <div style={{ fontSize: 16, letterSpacing: 6, fontWeight: 500 }}>CASAS</div>
          </div>
          <GoldLine width={30} margin="0 0 16px 0" />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Tu hogar empieza aqui.</p>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 16 }}><span>IG</span><span>FB</span><span>LI</span></div>
        </div>
        {[
          { t: "INMUEBLES", l: ["Comprar", "Alquilar", "Mapa interactivo"] },
          { t: "SERVICIOS", l: ["Vender", "Reformas", "Hipotecas", "Administracion"] },
          { t: "EMPRESA", l: ["Nosotros", "Contacto", "Aviso legal", "Privacidad"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, marginBottom: 14, color: "rgba(255,255,255,0.25)" }}>{col.t}</div>
            {col.l.map((link, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 8, cursor: "pointer" }}>{link}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: 16, fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>2026 Casas Group. Todos los derechos reservados.</div>
    </div>
  );
}

export default function CasasApp() {
  const [view, setView] = useState("home");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [zoom, setZoom] = useState(100);
  const goContact = () => setView("contact");
  const goHome = () => setView("home");

  const content = (() => {
    if (view === "search") return <SearchPage onBack={goHome} onContact={goContact} onProperty={(p) => { setSelectedProperty(p); setView("property"); }} />;
    if (view === "property") return <PropertyPage property={selectedProperty} onBack={() => setView("search")} onHome={goHome} onContact={goContact} />;
    if (view === "contact") return <ContactPage onHome={goHome} />;
    if (view === "vender") return <VenderPage onHome={goHome} onContact={goContact} />;
    if (view === "nosotros") return <NosotrosPage onHome={goHome} onContact={goContact} />;
    return <HomePage onSearch={() => setView("search")} onContact={goContact} onVender={() => setView("vender")} onNosotros={() => setView("nosotros")} />;
  })();

  return (
    <div>
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: "#fff", padding: "6px 12px", borderBottom: "1px solid #E8E6DF", display: "flex", gap: 6, alignItems: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>
        <span style={{ color: "#7A7A74" }}>Zoom:</span>
        {[100, 75, 50].map(z => (
          <span key={z} onClick={() => setZoom(z)} style={{ padding: "3px 10px", borderRadius: 12, cursor: "pointer", background: zoom === z ? "#a47b36" : "#F7F5F0", color: zoom === z ? "#fff" : "#7A7A74", fontWeight: zoom === z ? 500 : 400 }}>{z}%</span>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", width: zoom < 100 ? `${10000 / zoom}%` : "100%" }}>
        {content}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════ */
function HomePage({ onSearch, onContact, onVender, onNosotros }) {
  const [heroTab, setHeroTab] = useState("comprar");
  const [propFilter, setPropFilter] = useState("Venta");
  const [bigHover, setBigHover] = useState(null);
  const sliderRef = useRef(null);
  const [whySlide, setWhySlide] = useState(0);
  const scrollSlider = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const heroContent = {
    comprar: { placeholder: "Ciudad, provincia, barrio o zona...", show: "search" },
    alquilar: { placeholder: "Ciudad, provincia, barrio o zona...", show: "search" },
    vender: { tagline: "Descubre el valor real de tu vivienda con una valoracion gratuita", cta: "Solicitar valoracion gratuita" },
    reformas: { tagline: "Transforma tu hogar con nuestro equipo de profesionales", cta: "Solicitar presupuesto" },
    hipotecas: { tagline: "Te ayudamos a encontrar la mejor financiacion para tu nuevo hogar", cta: "Hablar con un asesor" },
  };
  const current = heroContent[heroTab];

  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff" }}>
      <Navbar onHome={() => {}} onContact={onContact} />

      {/* HERO */}
      <div style={{ position: "relative", minHeight: 580, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: warmGray }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.08, fontSize: 12, color: textMuted }}>Foto interior premium</div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 32px", width: "100%", maxWidth: 560 }}>
          <Logo size="lg" />
          <p style={{ fontSize: 17, color: textSecondary, lineHeight: 1.8, maxWidth: 420, margin: "20px auto 32px", fontWeight: 400, letterSpacing: 0.2 }}>Tu hogar empieza aqui.</p>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 20 }}>
            {["comprar", "alquilar", "vender", "reformas", "hipotecas"].map(tab => (
              <span key={tab} onClick={() => setHeroTab(tab)} style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", paddingBottom: 6, borderBottom: heroTab === tab ? `2px solid ${gold}` : "2px solid transparent", color: heroTab === tab ? textPrimary : textMuted, fontWeight: heroTab === tab ? 500 : 400, transition: "all 0.2s" }}>{tab}</span>
            ))}
          </div>

          {/* Dynamic content */}
          <div style={{ height: 120, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            {current.show === "search" ? (
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", background: "#fff", borderRadius: 40, border: `0.5px solid ${borderLight}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                  <input type="text" placeholder={current.placeholder} disabled style={{ flex: 1, border: "none", padding: "14px 20px", fontSize: 13, background: "transparent", outline: "none" }} />
                  <button onClick={onSearch} style={{ background: gold, color: "#fff", border: "none", padding: "14px 22px", cursor: "pointer", fontSize: 15, borderRadius: "0 40px 40px 0" }}>{"\u2315"}</button>
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: textMuted, textAlign: "center" }}>
                  Prefiero hablar con alguien <span style={{ color: gold, cursor: "pointer" }}>Contactar</span> | <span style={{ color: gold, cursor: "pointer" }}>+34 6XX XXX XXX</span>
                </div>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 28px", border: `0.5px solid ${borderLight}`, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", width: "100%" }}>
                <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, marginBottom: 14, textAlign: "center" }}>{current.tagline}</p>
                <div style={{ textAlign: "center" }}>
                  <button onClick={heroTab === "vender" ? onVender : onContact} style={{ background: gold, color: "#fff", border: "none", padding: "11px 24px", borderRadius: 24, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{current.cta} {"\u2192"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NUESTROS SERVICIOS */}
      <div id="mas-servicios" style={{ padding: "64px 36px" }}>
        <SectionTitle center sub={"Todo lo que necesitas en un solo lugar"}>NUESTROS SERVICIOS</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 24 }}>
          {[
            { icon: "\u25A3", t: "Administracion de fincas", d: "Gestion integral de tu comunidad con transparencia" },
            { icon: "\u25C6", t: "Hipotecas", d: "Te ayudamos a encontrar la mejor financiacion" },
            { icon: "\u26A1", t: "Cambio de suministros", d: "Luz, gas y seguros — nos encargamos por ti" },
            { icon: "\u25C9", t: "Seguros", d: "Protege tu vivienda con las mejores opciones" },
          ].map((s, i) => (
            <div key={i} style={{ border: `0.5px solid ${borderLight}`, borderRadius: 12, padding: 18, display: "flex", gap: 12, cursor: "pointer", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 20, color: gold, flexShrink: 0 }}>{s.icon}</div>
              <div><div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{s.t}</div><div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7 }}>{s.d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* VALORACION GRATUITA */}
      <div style={{ padding: "0 36px 64px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", background: goldBg, borderRadius: 16, padding: 36, border: `0.5px solid ${borderLight}` }}>
          <div style={{ flex: 1 }}>
            <SectionTitle>VALORACION</SectionTitle>
            <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8, marginBottom: 20 }}>Valoracion profesional gratuita y sin compromiso, basada en datos reales de tu zona.</p>
            <button style={{ background: gold, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 24, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Solicitar valoracion gratuita {"\u2192"}</button>
          </div>
          <div style={{ width: 200, height: 150, background: "#fff", borderRadius: 12, border: `0.5px solid ${borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, textAlign: "center", flexShrink: 0 }}>Ilustracion o foto</div>
        </div>
      </div>

      {/* POR QUE ELEGIRNOS — SLIDER */}
      {(() => {
        const whyItems = [
          { title: "Excelencia en cada detalle", desc: "Cuidamos cada paso del proceso para que tu experiencia sea impecable. Desde la primera consulta hasta la entrega de llaves, cada detalle esta pensado.", img: "Foto oficina / reunion" },
          { title: "Trato cercano y personal", desc: "Detras de cada operacion hay personas que entienden lo que necesitas. Te escuchamos, te asesoramos y te acompanamos en todo momento.", img: "Foto equipo trabajando" },
          { title: "Conocimiento local real", desc: "Especialistas en la zona con datos reales de mercado. Conocemos cada barrio, cada calle, cada oportunidad.", img: "Foto zona / barrio" },
          { title: "Resultados que hablan", desc: "Mas de 150 operaciones exitosas, un 98% de satisfaccion y una media de 45 dias para vender. Los numeros nos respaldan.", img: "Foto inmueble vendido" },
        ];
        const current = whyItems[whySlide];
        return (
          <div style={{ padding: "64px 36px", background: warmGray }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <SectionTitle>POR QUE ELEGIRNOS</SectionTitle>
              <div style={{ display: "flex", gap: 8 }}>
                <div onClick={() => setWhySlide(whySlide > 0 ? whySlide - 1 : whyItems.length - 1)} style={{ width: 40, height: 40, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: textSecondary }}>{"\u2190"}</div>
                <div onClick={() => setWhySlide(whySlide < whyItems.length - 1 ? whySlide + 1 : 0)} style={{ width: 40, height: 40, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: textSecondary }}>{"\u2192"}</div>
              </div>
            </div>
            <div style={{ display: "flex", borderRadius: 16, overflow: "hidden", border: `0.5px solid ${borderLight}` }}>
              <div style={{ width: "45%", background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textMuted, minHeight: 320, flexShrink: 0 }}>
                {current.img}
              </div>
              <div style={{ flex: 1, background: "#fff", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 16, color: textMuted }}>{whySlide + 1}</div>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: textMuted }}>{whySlide + 1} / {whyItems.length}</div>
                </div>
                <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, color: textPrimary, marginBottom: 14, lineHeight: 1.3 }}>{current.title}</div>
                <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8 }}>{current.desc}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: borderLight, borderRadius: 12, overflow: "hidden", marginTop: 32 }}>
              {[{ n: "+150", l: "Operaciones" }, { n: "98%", l: "Satisfaccion" }, { n: "45", l: "Dias venta media" }, { n: "+10", l: "Anos experiencia" }].map((s, i) => (
                <div key={i} style={{ background: "#fff", textAlign: "center", padding: "20px 8px" }}>
                  <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, color: gold, letterSpacing: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: textSecondary, marginTop: 4, letterSpacing: 0.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* COMPRAR / ALQUILAR / VENDER */}
      <div>
        {[
          { title: "Comprar", desc: "Encuentra tu proximo hogar entre nuestra seleccion de inmuebles" },
          { title: "Alquilar", desc: "Pisos y casas en alquiler listos para entrar a vivir" },
          { title: "Vender", desc: "Descubre el valor real de tu vivienda con valoracion gratuita" },
        ].map((item, i) => (
          <div key={i} onMouseEnter={() => setBigHover(i)} onMouseLeave={() => setBigHover(null)} style={{ position: "relative", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", borderBottom: `0.5px solid ${borderLight}`, cursor: "pointer", overflow: "hidden", background: bigHover === i ? warmGray : "#fff", transition: "background 0.3s" }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: bigHover === i ? borderLight : warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, opacity: 0.4, transition: "background 0.3s" }}>Foto</div>
            <div style={{ position: "relative", zIndex: 1, maxWidth: "55%" }}>
              <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 500, letterSpacing: 3, marginBottom: 6, color: gold, transition: "letter-spacing 0.3s" }}>{item.title}</div>
              <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
            <div style={{ position: "relative", zIndex: 1, fontSize: 22, color: gold, marginRight: "36%", opacity: bigHover === i ? 1 : 0.5, transition: "opacity 0.3s" }}>{"\u2192"}</div>
          </div>
        ))}
      </div>

      {/* NOSOTROS */}
      <div style={{ padding: "64px 36px" }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <div style={{ width: 260, height: 190, background: warmGray, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, textAlign: "center", flexShrink: 0, border: `0.5px solid ${borderLight}` }}>Foto del equipo</div>
          <div style={{ flex: 1 }}>
            <SectionTitle>CASAS GROUP</SectionTitle>
            <GoldLine width={30} margin="12px 0 16px" />
            <p style={{ fontFamily: serif, fontSize: 18, fontStyle: "italic", color: textSecondary, lineHeight: 1.8, marginBottom: 12 }}>"Porque entendimos que el sector no necesitaba mas de lo mismo."</p>
            <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, marginBottom: 16 }}>Una marca pensada para superar expectativas y cuidar cada detalle con excelencia.</p>
            <div onClick={onNosotros} style={{ fontSize: 13, color: gold, cursor: "pointer" }}>Conocenos {"\u2192"}</div>
          </div>
        </div>
      </div>

      {/* ULTIMAS PROPIEDADES — SLIDER */}
      <div style={{ padding: "64px 0", background: warmGray }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, padding: "0 36px" }}>
          <SectionTitle sub={"Seleccion de inmuebles disponibles"}>PROPIEDADES</SectionTitle>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["Venta", "Alquiler"].map(pill => (
                <span key={pill} onClick={() => setPropFilter(pill)} style={{ padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", border: `1px solid ${propFilter === pill ? gold : borderLight}`, background: propFilter === pill ? gold : "#fff", color: propFilter === pill ? "#fff" : textSecondary, transition: "all 0.2s" }}>{pill}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div onClick={() => scrollSlider(-1)} style={{ width: 36, height: 36, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: textSecondary }}>{"\u2190"}</div>
              <div onClick={() => scrollSlider(1)} style={{ width: 36, height: 36, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: textSecondary }}>{"\u2192"}</div>
            </div>
          </div>
        </div>
        <div ref={sliderRef} style={{ display: "flex", gap: 16, overflowX: "auto", scrollbarWidth: "none", padding: "0 36px", scrollSnapType: "x mandatory" }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {[
            { zone: "Esplugues", title: "Piso reformado con terraza", beds: 3, baths: 2, m2: 95, price: "285.000 \u20ac", tag: "Nuevo" },
            { zone: "Sant Just Desvern", title: "Casa adosada con jardin", beds: 4, baths: 2, m2: 180, price: "520.000 \u20ac" },
            { zone: "Cornella", title: "Atico con vistas panoramicas", beds: 2, baths: 1, m2: 72, price: "320.000 \u20ac" },
            { zone: "Hospitalet", title: "Piso luminoso a estrenar", beds: 3, baths: 2, m2: 88, price: "310.000 \u20ac", tag: "Nuevo" },
            { zone: "Sant Joan Despi", title: "Duplex con terraza y parking", beds: 4, baths: 2, m2: 130, price: "480.000 \u20ac" },
            { zone: "Esplugues", title: "Estudio reformado centrico", beds: 1, baths: 1, m2: 45, price: "165.000 \u20ac" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.3s, transform 0.3s", minWidth: 260, flexShrink: 0, scrollSnapAlign: "start" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ height: 180, background: "#EFEDE8", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted }}>
                Foto propiedad
                {p.tag && <span style={{ position: "absolute", top: 10, left: 10, background: gold, color: "#fff", fontSize: 9, padding: "4px 12px", borderRadius: 12, fontWeight: 500, letterSpacing: 0.5 }}>{p.tag}</span>}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: gold, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{p.zone}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{p.title}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 12, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} ba</span><span>{p.m2} m{"\u00b2"}</span></div>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, marginTop: 10, color: charcoal800 }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, fontSize: 13, color: gold, cursor: "pointer", textAlign: "center" }}>Ver todas las propiedades {"\u2192"}</div>
      </div>

      <Footer />

      <div style={{ padding: "16px 36px", textAlign: "center" }}>
        <button onClick={onSearch} style={{ background: gold, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 24, fontSize: 13, cursor: "pointer", fontWeight: 500, marginRight: 8 }}>Ver busqueda {"\u2192"}</button>
        <button onClick={onContact} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "12px 28px", borderRadius: 24, fontSize: 13, cursor: "pointer", marginRight: 8 }}>Ver contacto</button>
        <button onClick={onVender} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "12px 28px", borderRadius: 24, fontSize: 13, cursor: "pointer", marginRight: 8 }}>Ver vender</button>
        <button onClick={onNosotros} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "12px 28px", borderRadius: 24, fontSize: 13, cursor: "pointer" }}>Ver nosotros</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════ */
function SearchPage({ onBack, onProperty, onContact }) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedZone, setSelectedZone] = useState("Todas");
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const zones = ["Todas", "Eixample", "Gracia", "Sant Marti", "Sants", "Poble Sec", "Les Corts", "Sarria", "Horta"];
  const properties = [
    { id: 1, zone: "Eixample", title: "Piso reformado luminoso", beds: 3, baths: 2, m2: 95, price: "385.000 \u20ac", desc: "Magnifico piso completamente reformado en finca regia. Techos altos, suelos de parquet, cocina equipada." },
    { id: 2, zone: "Gracia", title: "Atico con terraza privada", beds: 2, baths: 1, m2: 68, price: "295.000 \u20ac", desc: "Atico luminoso con terraza de 15m2 con vistas a la ciudad." },
    { id: 3, zone: "Sant Marti", title: "Piso a estrenar", beds: 4, baths: 2, m2: 110, price: "450.000 \u20ac", desc: "Obra nueva con materiales de primera calidad." },
    { id: 4, zone: "Sants", title: "Estudio con balcon", beds: 1, baths: 1, m2: 42, price: "175.000 \u20ac", desc: "Perfecto como primera vivienda o inversion." },
    { id: 5, zone: "Poble Sec", title: "Piso con encanto", beds: 2, baths: 1, m2: 65, price: "260.000 \u20ac", desc: "Piso con caracter en finca clasica." },
    { id: 6, zone: "Les Corts", title: "Duplex con parking", beds: 3, baths: 2, m2: 120, price: "510.000 \u20ac", desc: "Espectacular duplex con plaza de parking." },
  ];
  const pins = [{ price: "385k", top: "22%", left: "40%" }, { price: "295k", top: "35%", left: "60%" }, { price: "450k", top: "50%", left: "28%" }, { price: "175k", top: "30%", left: "72%" }, { price: "260k", top: "60%", left: "50%" }, { price: "510k", top: "45%", left: "18%" }];

  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff", position: "relative" }}>
      <Navbar onHome={onBack} onContact={onContact} />
      <div style={{ padding: "16px 24px", background: warmGray, borderBottom: `0.5px solid ${borderLight}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", background: "#fff", borderRadius: 36, border: `0.5px solid ${borderLight}`, overflow: "hidden", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
            <input type="text" placeholder="Ciudad, provincia, barrio o zona..." disabled value="Barcelona" style={{ flex: 1, border: "none", padding: "12px 18px", fontSize: 13, background: "transparent", outline: "none", color: textPrimary }} />
            <button style={{ background: gold, color: "#fff", border: "none", padding: "12px 20px", cursor: "pointer", fontSize: 14, borderRadius: "0 36px 36px 0" }}>{"\u2315"}</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Compra", "Alquiler"].map((t, i) => (
              <span key={t} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", background: i === 0 ? gold : "#fff", color: i === 0 ? "#fff" : textSecondary, border: `0.5px solid ${i === 0 ? gold : borderLight}` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "12px 24px", borderBottom: `0.5px solid ${borderLight}`, flexWrap: "wrap", alignItems: "center" }}>
        <div onClick={() => setShowFilters(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: `1px solid ${textSecondary}`, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>{"\u2630"} Filtros</div>
        <div style={{ position: "relative" }}>
          <span onClick={() => setShowZoneDropdown(!showZoneDropdown)} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: `0.5px solid ${selectedZone !== "Todas" ? gold : borderLight}`, background: selectedZone !== "Todas" ? goldBg : "#fff", color: selectedZone !== "Todas" ? gold : textSecondary, fontWeight: selectedZone !== "Todas" ? 500 : 400 }}>Zona: {selectedZone} {"\u25BE"}</span>
          {showZoneDropdown && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, minWidth: 160, overflow: "hidden" }}>
              {zones.map((z, i) => (
                <div key={z} onClick={() => { setSelectedZone(z); setShowZoneDropdown(false); }} style={{ padding: "10px 14px", fontSize: 12, cursor: "pointer", color: z === selectedZone ? gold : textSecondary, fontWeight: z === selectedZone ? 500 : 400, background: z === selectedZone ? goldBg : "#fff", borderBottom: i < zones.length - 1 ? `0.5px solid ${borderLight}` : "none" }}>{z}</div>
              ))}
            </div>
          )}
        </div>
        {["Precio", "Habitaciones", "Banos", "Superficie", "Tipo"].map((f, i) => (
          <span key={i} style={{ padding: "7px 14px", borderRadius: 20, border: `0.5px solid ${borderLight}`, fontSize: 11, color: textSecondary, cursor: "pointer" }}>{f}</span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <span onClick={() => setViewMode("grid")} style={{ padding: "6px 10px", borderRadius: 6, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", background: viewMode === "grid" ? warmGray : "#fff" }}>{"\u2637"}</span>
          <span onClick={() => setViewMode("list")} style={{ padding: "6px 10px", borderRadius: 6, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", background: viewMode === "list" ? warmGray : "#fff" }}>{"\u2630"}</span>
        </div>
      </div>
      <div style={{ display: "flex", minHeight: 560 }}>
        <div style={{ flex: 1, padding: 16, overflowY: "auto", borderRight: `0.5px solid ${borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div><div style={{ fontSize: 13, fontWeight: 500 }}>24 inmuebles en Barcelona</div><div style={{ fontSize: 11, color: textMuted }}>Compra {selectedZone !== "Todas" ? `\u00b7 ${selectedZone}` : ""}</div></div>
            <div style={{ fontSize: 11, color: textSecondary }}>Mas recientes</div>
          </div>
          {viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              {properties.map((p, i) => (
                <div key={i} onClick={() => onProperty(p)} style={{ border: `0.5px solid ${borderLight}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ height: 100, background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted, position: "relative" }}>Foto<div style={{ position: "absolute", top: 6, right: 6, fontSize: 14, color: textMuted, opacity: 0.4 }}>{"\u2661"}</div></div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 9, color: gold, letterSpacing: 1, marginBottom: 2, textTransform: "uppercase" }}>{p.zone}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 6, fontSize: 10, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} ba</span><span>{p.m2} m{"\u00b2"}</span></div>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, marginTop: 6 }}>{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {properties.map((p, i) => (
                <div key={i} onClick={() => onProperty(p)} style={{ display: "flex", border: `0.5px solid ${borderLight}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ width: 140, background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted, flexShrink: 0 }}>Foto</div>
                  <div style={{ padding: 12, flex: 1 }}>
                    <div style={{ fontSize: 9, color: gold, letterSpacing: 1, marginBottom: 2, textTransform: "uppercase" }}>{p.zone}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 10, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} ba</span><span>{p.m2} m{"\u00b2"}</span></div>
                    <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, marginTop: 6 }}>{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: "45%", background: warmGray, position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", fontSize: 11, color: textMuted }}>
            <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.3 }}>{"\u2691"}</div>Mapa interactivo<br />Se actualiza al mover
          </div>
          {pins.map((pin, i) => (
            <div key={i} style={{ position: "absolute", top: pin.top, left: pin.left, background: "#fff", border: `1px solid ${borderLight}`, borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = textPrimary; e.currentTarget.style.transform = "scale(1)"; }}>
              {pin.price}
            </div>
          ))}
        </div>
      </div>
      {showFilters && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowFilters(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 16, width: "90%", maxWidth: 540, maxHeight: "80vh", overflow: "auto", boxShadow: "0 16px 64px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `0.5px solid ${borderLight}`, position: "sticky", top: 0, background: "#fff", zIndex: 1, borderRadius: "16px 16px 0 0" }}>
              <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>Filtros</span>
              <span onClick={() => setShowFilters(false)} style={{ fontSize: 20, color: textMuted, cursor: "pointer" }}>{"\u2715"}</span>
            </div>
            <div style={{ padding: 24 }}>
              {[
                { label: "Precio", type: "range", fields: ["Minimo", "Maximo"] },
                { label: "Zona", type: "dropdown" },
                { label: "Categoria", type: "pills", options: ["Piso", "Chalet", "Local", "Parking"], selected: 0 },
                { label: "Estado", type: "pills", options: ["En venta", "En alquiler", "Opcion compra"], selected: 0 },
                { label: "Dormitorios", type: "pills", options: ["Cualquier", "1+", "2+", "3+", "4+"], selected: -1 },
                { label: "Banos", type: "pills", options: ["Cualquier", "1+", "2+", "3+", "4+"], selected: -1 },
                { label: "Superficie", type: "range", fields: ["Min m\u00b2", "Max m\u00b2"] },
              ].map((filter, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>{filter.label}</div>
                  {filter.type === "range" ? (
                    <div style={{ display: "flex", gap: 12 }}>
                      {filter.fields.map((f, j) => (
                        <div key={j} style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 12, color: textMuted }}>{f}</div>
                      ))}
                    </div>
                  ) : filter.type === "dropdown" ? (
                    <div style={{ position: "relative" }}>
                      <div onClick={() => setShowZoneModal(!showZoneModal)} style={{ border: `0.5px solid ${showZoneModal ? gold : borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: selectedZone === "Todas" ? textMuted : textPrimary, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        <span>{selectedZone === "Todas" ? "Seleccionar zona..." : selectedZone}</span>
                        <span style={{ fontSize: 10, color: textMuted, transition: "transform 0.2s", transform: showZoneModal ? "rotate(180deg)" : "rotate(0deg)" }}>{"\u25BE"}</span>
                      </div>
                      {showZoneModal && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, maxHeight: 200, overflowY: "auto" }}>
                          {zones.map((z, zi) => (
                            <div key={z} onClick={() => { setSelectedZone(z); setShowZoneModal(false); }} style={{ padding: "10px 14px", fontSize: 12, cursor: "pointer", color: z === selectedZone ? gold : textSecondary, fontWeight: z === selectedZone ? 500 : 400, background: z === selectedZone ? goldBg : "#fff", borderBottom: zi < zones.length - 1 ? `0.5px solid ${borderLight}` : "none" }}>{z}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {filter.options.map((opt, j) => (
                        <span key={j} style={{ padding: "8px 16px", borderRadius: 20, border: `0.5px solid ${j === filter.selected ? gold : borderLight}`, fontSize: 12, background: j === filter.selected ? goldBg : "#fff", color: j === filter.selected ? gold : textSecondary, fontWeight: j === filter.selected ? 500 : 400, cursor: "pointer" }}>{opt}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: `0.5px solid ${borderLight}`, position: "sticky", bottom: 0, background: "#fff", borderRadius: "0 0 16px 16px" }}>
              <span style={{ fontSize: 12, color: textSecondary, textDecoration: "underline", cursor: "pointer" }}>Quitar filtros</span>
              <button onClick={() => setShowFilters(false)} style={{ background: gold, color: "#fff", border: "none", padding: "11px 24px", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Mostrar 24 inmuebles</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: "16px 24px", textAlign: "center", borderTop: `0.5px solid ${borderLight}` }}>
        <button onClick={onBack} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "10px 24px", borderRadius: 24, fontSize: 12, cursor: "pointer" }}>{"\u2190"} Volver a la Home</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROPERTY
   ═══════════════════════════════════════════ */
function PropertyPage({ property, onBack, onHome, onContact }) {
  if (!property) return null;
  const p = property;
  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff" }}>
      <Navbar onHome={onHome} onContact={onContact} />
      <div style={{ padding: "10px 32px", borderBottom: `0.5px solid ${borderLight}` }}>
        <span onClick={onBack} style={{ fontSize: 12, color: textSecondary, cursor: "pointer" }}>{"\u2190"} Volver a busqueda</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "200px 200px", gap: 4 }}>
        <div style={{ background: warmGray, gridRow: "1 / 3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textMuted }}>Foto principal</div>
        <div style={{ background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted }}>Foto 2</div>
        <div style={{ background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted }}>Foto 3</div>
        <div style={{ background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted }}>Foto 4</div>
        <div style={{ background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted, position: "relative" }}>Foto 5<span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, padding: "4px 12px", borderRadius: 16 }}>Ver todas</span></div>
      </div>
      <div style={{ display: "flex", gap: 28, padding: "28px 32px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: gold, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>{p.zone} {"\u00b7"} Ref. CG-{p.id.toString().padStart(4, "0")}</div>
          <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, letterSpacing: 0.5, marginBottom: 8 }}>{p.title}</div>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, marginBottom: 20, color: charcoal800 }}>{p.price}</div>
          <div style={{ display: "flex", gap: 16, padding: "18px 0", borderTop: `0.5px solid ${borderLight}`, borderBottom: `0.5px solid ${borderLight}`, marginBottom: 24 }}>
            {[{ v: `${p.beds}`, l: "Dormitorios" }, { v: `${p.baths}`, l: "Banos" }, { v: `${p.m2} m\u00b2`, l: "Superficie" }, { v: "3a", l: "Planta" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: textSecondary, marginTop: 3, letterSpacing: 0.3 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Descripcion</div>
            <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.8 }}>{p.desc}</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Caracteristicas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Ascensor", "Terraza", "Aire acondicionado", "Calefaccion", "Parquet", "Trastero"].map((f, i) => (
                <span key={i} style={{ padding: "7px 16px", borderRadius: 20, background: warmGray, fontSize: 11, color: textSecondary }}>{f}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Ubicacion</div>
            <div style={{ height: 200, background: warmGray, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, border: `0.5px solid ${borderLight}` }}>Mapa con pin</div>
          </div>
        </div>
        <div style={{ width: 250, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 80, background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Te interesa este inmueble?</div>
            <GoldLine width={20} margin="0 0 12px 0" />
            <p style={{ fontSize: 12, color: textSecondary, lineHeight: 1.6, marginBottom: 18 }}>Contactanos y te ayudamos con todos los detalles.</p>
            <button style={{ background: gold, color: "#fff", border: "none", padding: "12px 0", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", width: "100%", marginBottom: 8 }}>Contactar {"\u2192"}</button>
            <button style={{ background: "#25D366", color: "#fff", border: "none", padding: "12px 0", borderRadius: 24, fontSize: 12, fontWeight: 500, cursor: "pointer", width: "100%", marginBottom: 8 }}>WhatsApp</button>
            <button style={{ background: "transparent", color: textSecondary, border: `0.5px solid ${borderLight}`, padding: "12px 0", borderRadius: 24, fontSize: 12, cursor: "pointer", width: "100%" }}>Enviar email</button>
            <div style={{ marginTop: 14, fontSize: 10, color: textMuted, textAlign: "center" }}>Ref. CG-{p.id.toString().padStart(4, "0")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════ */
function ContactPage({ onHome }) {
  const [showForm, setShowForm] = useState(false);
  const [showMotivo, setShowMotivo] = useState(false);
  const [motivo, setMotivo] = useState("Comprar");
  const motivos = ["Comprar", "Alquilar", "Vender", "Reformas", "Hipotecas", "Administracion", "Otro"];
  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff", position: "relative", overflow: "hidden" }}>
      <Navbar onHome={onHome} onContact={() => {}} />

      {/* HERO */}
      <div style={{ padding: "80px 36px", textAlign: "center", background: warmGray }}>
        <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 300, color: gold, letterSpacing: 0, marginBottom: 16, lineHeight: 1.1 }}>Hablemos</div>
        <p style={{ fontSize: 16, color: textSecondary, maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.7 }}>Estamos aqui para ayudarte en cada paso. Cuentanos que necesitas.</p>
        <button onClick={() => setShowForm(true)} style={{ background: gold, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 24, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
          Escribenos {"\u2192"}
        </button>
      </div>

      {/* CONTACT INFO */}
      <div style={{ display: "flex", minHeight: 400 }}>
        <div style={{ width: "45%", background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textMuted, flexShrink: 0 }}>
          Foto equipo / oficina
        </div>
        <div style={{ flex: 1, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 300, color: textPrimary, lineHeight: 1.4, marginBottom: 32 }}>
            Si lo prefieres, contactanos directamente.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Email</div>
              <div style={{ fontSize: 14, color: textSecondary }}>info@casasgroup.es</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Telefono</div>
              <div style={{ fontSize: 14, color: textSecondary }}>+34 123 456 789</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>WhatsApp</div>
              <div style={{ fontSize: 14, color: textSecondary }}>+34 6XX XXX XXX</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Horario</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6 }}>Lun - Vie: 9:00 - 19:00<br />Sab: 10:00 - 14:00</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {["\uD83D\uDCF7", "\uD83C\uDF10", "\uD83D\uDCBC"].map((icon, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: `0.5px solid ${borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* DONDE ESTAMOS */}
      <div style={{ display: "flex", background: goldBg, minHeight: 360 }}>
        <div style={{ width: "45%", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: gold, fontWeight: 500, marginBottom: 12 }}>DONDE ESTAMOS</div>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 300, lineHeight: 1.3, marginBottom: 24, color: textPrimary }}>Visitanos en nuestra oficina</div>
          <GoldLine width={30} margin="0 0 24px 0" />
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, marginBottom: 8, color: textPrimary }}>Esplugues de Llobregat</div>
            <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7 }}>
              Calle Ejemplo 123, Local 2<br />
              08950 Esplugues de Llobregat<br />
              Barcelona
            </div>
          </div>
          <div style={{ fontSize: 12, color: textMuted }}>
            Lunes a Viernes: 9:00 - 19:00<br />
            Sabado: 10:00 - 14:00
          </div>
        </div>
        <div style={{ flex: 1, background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textMuted, position: "relative" }}>
          Mapa interactivo Google Maps
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 40, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: serif, fontSize: 12, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>CG</div>
        </div>
      </div>

      <Footer />
      <div style={{ padding: "16px 36px", textAlign: "center" }}>
        <button onClick={onHome} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "10px 24px", borderRadius: 24, fontSize: 12, cursor: "pointer" }}>{"\u2190"} Volver a la Home</button>
      </div>

      {/* FORM PANEL */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", zIndex: 201, overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `0.5px solid ${borderLight}` }}>
              <div>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>Cuentanos en que</div>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>podemos ayudarte</div>
              </div>
              <span onClick={() => setShowForm(false)} style={{ fontSize: 22, color: textMuted, cursor: "pointer" }}>{"\u2715"}</span>
            </div>
            <div style={{ padding: "24px 28px" }}>
              {[
                { label: "Nombre *", placeholder: "Tu nombre" },
                { label: "Apellidos *", placeholder: "Tus apellidos" },
                { label: "Email *", placeholder: "tu@email.com" },
                { label: "Telefono *", placeholder: "+34 6XX XXX XXX" },
              ].map((f, i) => (
                <div key={i} style={{ marginBottom: 20, borderBottom: `0.5px solid ${borderLight}`, paddingBottom: 8 }}>
                  <div style={{ fontSize: 10, color: textMuted, marginBottom: 4, letterSpacing: 0.3 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: textMuted }}>{f.placeholder}</div>
                </div>
              ))}
              <div style={{ marginBottom: 20, borderBottom: `0.5px solid ${borderLight}`, paddingBottom: 8, position: "relative" }}>
                <div style={{ fontSize: 10, color: textMuted, marginBottom: 4, letterSpacing: 0.3 }}>Motivo de contacto *</div>
                <div onClick={() => setShowMotivo(!showMotivo)} style={{ fontSize: 14, color: textPrimary, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <span>{motivo}</span>
                  <span style={{ fontSize: 10, color: textMuted }}>{"\u25BE"}</span>
                </div>
                {showMotivo && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20, overflow: "hidden" }}>
                    {motivos.map((m, i) => (
                      <div key={m} onClick={() => { setMotivo(m); setShowMotivo(false); }} style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer", color: m === motivo ? gold : textSecondary, fontWeight: m === motivo ? 500 : 400, background: m === motivo ? goldBg : "#fff", borderBottom: i < motivos.length - 1 ? `0.5px solid ${borderLight}` : "none" }}>{m}</div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 20, borderBottom: `0.5px solid ${borderLight}`, paddingBottom: 8 }}>
                <div style={{ fontSize: 10, color: textMuted, marginBottom: 4, letterSpacing: 0.3 }}>Referencia de inmueble</div>
                <div style={{ fontSize: 14, color: textMuted }}>Ej: CG-0001</div>
              </div>
              <div style={{ marginBottom: 20, borderBottom: `0.5px solid ${borderLight}`, paddingBottom: 8 }}>
                <div style={{ fontSize: 10, color: textMuted, marginBottom: 4, letterSpacing: 0.3 }}>Mensaje</div>
                <div style={{ fontSize: 14, color: textMuted, minHeight: 60 }}>Escribe tu mensaje...</div>
              </div>
              <button style={{ background: gold, color: "#fff", border: "none", padding: "13px 0", borderRadius: 24, fontSize: 13, cursor: "pointer", fontWeight: 500, width: "100%", marginBottom: 8 }}>Enviar mensaje {"\u2192"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function VenderPage({ onHome, onContact }) {
  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff" }}>
      <Navbar onHome={onHome} onContact={onContact} />
      <div style={{ display: "flex", gap: 36, padding: "56px 36px", background: warmGray }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: gold, marginBottom: 14, fontWeight: 500 }}>VALORACION GRATUITA</div>
          <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 500, letterSpacing: 1, lineHeight: 1.3, marginBottom: 8 }}>Descubre cuanto vale tu piso o casa</div>
          <GoldLine width={30} margin="8px 0 16px" />
          <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.8, marginBottom: 24 }}>Obten una valoracion inmobiliaria gratuita y sin compromiso, basada en precios reales de mercado en tu zona.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Valoracion gratuita y sin compromiso", "Basada en ventas reales en tu zona", "Servicio exclusivo para propietarios"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: textSecondary }}>
                <span style={{ color: gold, fontSize: 14 }}>{"\u2713"}</span>{item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 320, flexShrink: 0, background: "#fff", borderRadius: 16, padding: 28, border: `0.5px solid ${borderLight}`, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Solicita tu valoracion gratuita</div>
          <p style={{ fontSize: 11, color: textMuted, marginBottom: 18 }}>Te contactamos en menos de 24 horas</p>
          {[{ label: "Nombre", placeholder: "Tu nombre" }, { label: "Telefono", placeholder: "+34 6XX XXX XXX" }, { label: "Email", placeholder: "tu@email.com" }].map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: textSecondary, marginBottom: 3 }}>{f.label}</div>
              <div style={{ border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: textMuted }}>{f.placeholder}</div>
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: textSecondary, marginBottom: 3 }}>Tipo de inmueble</div>
            <div style={{ border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: textPrimary, display: "flex", justifyContent: "space-between" }}><span>Piso</span><span style={{ fontSize: 10, color: textMuted }}>{"\u25BE"}</span></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: textSecondary, marginBottom: 3 }}>Direccion del inmueble</div>
            <div style={{ border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: textMuted }}>Calle, numero, ciudad...</div>
          </div>
          <button style={{ background: gold, color: "#fff", border: "none", padding: "12px 0", borderRadius: 24, fontSize: 12, cursor: "pointer", fontWeight: 500, width: "100%" }}>Enviar {"\u2192"}</button>
          <p style={{ fontSize: 9, color: textMuted, marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>Sin compromiso de venta. Solo para propietarios.</p>
        </div>
      </div>

      {/* CONTACTO DIRECTO */}
      <div style={{ padding: "48px 36px", textAlign: "center", borderBottom: `0.5px solid ${borderLight}` }}>
        <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 300, color: textPrimary, marginBottom: 20 }}>Prefieres contactarnos directamente?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          {[
            { icon: "\u260E", label: "Telefono", value: "+34 123 456 789" },
            { icon: "W", label: "WhatsApp", value: "+34 6XX XXX XXX" },
            { icon: "\u2709", label: "Email", value: "info@casasgroup.es" },
          ].map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", border: `0.5px solid ${borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 18, color: gold }}>{c.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 13, color: textSecondary }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: borderLight }}>
        {[{ n: "+500", l: "Pisos vendidos" }, { n: "30", l: "Dias venta media" }, { n: "98%", l: "Clientes satisfechos" }, { n: "+10", l: "Anos de experiencia" }].map((s, i) => (
          <div key={i} style={{ background: "#fff", textAlign: "center", padding: "28px 8px" }}>
            <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, color: gold, letterSpacing: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: textSecondary, marginTop: 4, letterSpacing: 0.3 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "64px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: gold, marginBottom: 10, fontWeight: 500 }}>PROCESO SIMPLE</div>
          <SectionTitle center>COMO FUNCIONA</SectionTitle>
          <GoldLine width={40} margin="12px auto 0" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { step: "1", title: "Completa el formulario", desc: "Rellena el formulario con los datos de tu vivienda y nos pondremos en contacto contigo." },
            { step: "2", title: "Valoracion profesional", desc: "Nuestro equipo analizara tu inmueble y la zona para ofrecerte una valoracion basada en datos reales." },
            { step: "3", title: "Te explicamos el valor", desc: "Te contactaremos para explicarte el resultado, resolver dudas y ayudarte a entender el precio." },
            { step: "4", title: "Si decides vender", desc: "Si tras la valoracion decides vender, te ayudamos a hacerlo de forma segura y al mejor precio." },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: goldBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 16, fontWeight: 500, color: gold, marginBottom: 14 }}>{item.step}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "64px 36px", background: warmGray }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionTitle center>POR QUE VENDER CON NOSOTROS</SectionTitle>
          <GoldLine width={40} margin="12px auto 0" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: "\u2605", title: "Valoracion profesional", desc: "Estudio de mercado exhaustivo para determinar el precio optimo." },
            { icon: "\u2302", title: "Marketing premium", desc: "Fotografia profesional, tours virtuales y difusion en portales." },
            { icon: "\u2661", title: "Gestion de visitas", desc: "Filtramos y gestionamos visitas con compradores cualificados." },
            { icon: "\u2696", title: "Asesoria legal", desc: "Te acompanamos hasta la firma en notaria." },
            { icon: "\u2694", title: "Negociacion experta", desc: "Negociamos para conseguir las mejores condiciones." },
            { icon: "\u26A1", title: "Rapidez", desc: "Vendemos tu piso en el menor tiempo posible al mejor precio." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 22, border: `0.5px solid ${borderLight}` }}>
              <div style={{ fontSize: 24, color: gold, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "64px 36px", textAlign: "center" }}>
        <SectionTitle center>QUIERES SABER CUANTO VALE?</SectionTitle>
        <p style={{ fontSize: 13, color: textSecondary, marginBottom: 24, maxWidth: 400, margin: "8px auto 24px" }}>La valoracion es gratuita y no implica ningun compromiso de venta.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: gold, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 24, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Solicitar valoracion gratuita {"\u2192"}</button>
      </div>
      <Footer />
      <div style={{ padding: "16px 36px", textAlign: "center" }}>
        <button onClick={onHome} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "10px 24px", borderRadius: 24, fontSize: 12, cursor: "pointer" }}>{"\u2190"} Volver a la Home</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NOSOTROS
   ═══════════════════════════════════════════ */
function NosotrosPage({ onHome, onContact }) {
  const [activeValue, setActiveValue] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const values = [
    { title: "Excelencia", desc: "No nos conformamos con lo bueno. Cada detalle, cada gestion, cada interaccion esta pensada para superar expectativas. Porque creemos que la excelencia no es un destino, es un habito." },
    { title: "Cercania", desc: "Detras de cada operacion hay personas. Te escuchamos, te entendemos y te acompanamos. No somos una empresa mas, somos tu equipo." },
    { title: "Transparencia", desc: "Sin letras pequenas, sin sorpresas. Te contamos todo como es, con datos reales y honestidad absoluta. Tu confianza es nuestro mayor activo." },
    { title: "Ambicion", desc: "Nacimos con la vision de transformar el sector inmobiliario. No venimos a ser uno mas. Venimos a ser los mejores. Y cada dia trabajamos para demostrarlo." },
  ];

  const tabs = [
    { label: "Mision", content: "Ofrecer una experiencia inmobiliaria excepcional, donde cada cliente se sienta acompanado, asesorado y respaldado en una de las decisiones mas importantes de su vida. Transformar el sector con cercania, profesionalidad y atencion al detalle." },
    { label: "Vision", content: "Ser la referencia inmobiliaria en nuestra zona, reconocidos por la calidad de nuestro servicio, la confianza de nuestros clientes y la ambicion de hacer las cosas de la mejor manera posible." },
    { label: "Proposito", content: "Creemos que encontrar un hogar es mucho mas que una transaccion. Es un momento vital. Por eso existimos: para que ese momento sea tan especial como merece." },
  ];

  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff" }}>
      <Navbar onHome={onHome} onContact={onContact} />

      {/* HERO */}
      <div style={{ position: "relative", minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center", background: warmGray, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.08, fontSize: 12, color: textMuted }}>Foto equipo / oficina a pantalla completa</div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 36px", maxWidth: 560 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: gold, fontWeight: 500, marginBottom: 16 }}>NUESTRA HISTORIA</div>
          <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 300, color: textPrimary, lineHeight: 1.2, marginBottom: 16 }}>Porque el sector necesitaba algo diferente</div>
          <GoldLine width={40} margin="0 auto 16px" />
          <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.8 }}>Construida desde el amor, la vision, la ambicion y la pasion por hacer las cosas de la mejor manera.</p>
        </div>
      </div>

      {/* BRAND STORY — photo left, text right */}
      <div style={{ display: "flex", minHeight: 400 }}>
        <div style={{ width: "45%", background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: textMuted, flexShrink: 0 }}>
          Foto Angie / fundadora
        </div>
        <div style={{ flex: 1, padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: gold, fontWeight: 500, marginBottom: 12 }}>LA MARCA</div>
          <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, color: textPrimary, lineHeight: 1.3, marginBottom: 16 }}>De Red Casas a Casas Group</div>
          <GoldLine width={30} margin="0 0 16px 0" />
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8, marginBottom: 12 }}>Casas Group nacio de la conviccion de que el sector inmobiliario podia ofrecer mucho mas. Una marca pensada para superar expectativas, transformar la experiencia inmobiliaria y cuidar cada detalle con excelencia.</p>
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8 }}>No somos una inmobiliaria mas. Somos un equipo que entiende que comprar, vender o alquilar una vivienda es una de las decisiones mas importantes que tomamos. Y queremos que esa experiencia sea excepcional.</p>
        </div>
      </div>

      {/* MISION / VISION / PROPOSITO — tabs */}
      <div style={{ padding: "64px 36px", background: goldBg }}>
        <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
          {tabs.map((tab, i) => (
            <span key={i} onClick={() => setActiveTab(i)} style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, cursor: "pointer", paddingBottom: 8, borderBottom: activeTab === i ? `2px solid ${gold}` : "2px solid transparent", color: activeTab === i ? textPrimary : textMuted, transition: "all 0.2s" }}>{tab.label}</span>
          ))}
        </div>
        <div style={{ maxWidth: 560 }}>
          <p style={{ fontFamily: serif, fontSize: 22, fontWeight: 300, color: textPrimary, lineHeight: 1.7 }}>{tabs[activeTab].content}</p>
        </div>
      </div>

      {/* VALORES — interactive slider */}
      <div style={{ padding: "64px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <SectionTitle>NUESTROS VALORES</SectionTitle>
          <div style={{ display: "flex", gap: 8 }}>
            <div onClick={() => setActiveValue(activeValue > 0 ? activeValue - 1 : values.length - 1)} style={{ width: 40, height: 40, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: textSecondary }}>{"\u2190"}</div>
            <div onClick={() => setActiveValue(activeValue < values.length - 1 ? activeValue + 1 : 0)} style={{ width: 40, height: 40, borderRadius: "50%", border: `0.5px solid ${borderLight}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: textSecondary }}>{"\u2192"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", border: `0.5px solid ${borderLight}` }}>
          {/* Left: value list */}
          <div style={{ width: 220, background: warmGray, flexShrink: 0 }}>
            {values.map((v, i) => (
              <div key={i} onClick={() => setActiveValue(i)} style={{ padding: "20px 24px", cursor: "pointer", borderBottom: i < values.length - 1 ? `0.5px solid ${borderLight}` : "none", background: activeValue === i ? "#fff" : "transparent", borderRight: activeValue === i ? `2px solid ${gold}` : "2px solid transparent", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: serif, fontSize: 20, color: activeValue === i ? gold : textMuted, fontWeight: 500 }}>0{i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: activeValue === i ? 500 : 400, color: activeValue === i ? textPrimary : textSecondary }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Right: content + image */}
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ flex: 1, padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 500, color: gold, marginBottom: 4, letterSpacing: 0 }}>0{activeValue + 1}</div>
              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, color: textPrimary, marginBottom: 16, lineHeight: 1.3 }}>{values[activeValue].title}</div>
              <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8 }}>{values[activeValue].desc}</p>
            </div>
            <div style={{ width: "40%", background: "#EFEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, flexShrink: 0 }}>
              Foto valor
            </div>
          </div>
        </div>
      </div>

      {/* EQUIPO */}
      <div style={{ padding: "64px 36px", background: warmGray }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionTitle center>NUESTRO EQUIPO</SectionTitle>
          <p style={{ fontSize: 14, color: textSecondary, marginTop: 8 }}>Las personas detras de Casas Group</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            { name: "Angie Caballero", role: "Fundadora & CEO" },
            { name: "Nombre Apellido", role: "Director Comercial" },
            { name: "Nombre Apellido", role: "Agente Inmobiliario" },
            { name: "Nombre Apellido", role: "Administracion" },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: "100%", aspectRatio: "3/4", background: "#EFEDE8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, marginBottom: 12, border: `0.5px solid ${borderLight}` }}>
                Foto
              </div>
              <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: textSecondary }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ padding: "64px 36px" }}>
        <SectionTitle center>NUESTRA TRAYECTORIA</SectionTitle>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 32, position: "relative" }}>
          <div style={{ position: "absolute", top: 18, left: "10%", right: "10%", height: 1, background: borderLight }} />
          {[
            { year: "2014", text: "Nacimiento de Red Casas" },
            { year: "2018", text: "Expansion a nuevas zonas" },
            { year: "2023", text: "Mas de 100 operaciones" },
            { year: "2026", text: "Rebranding: Casas Group" },
          ].map((t, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 3 ? gold : "#fff", border: `1.5px solid ${i === 3 ? gold : borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: i === 3 ? "#fff" : textMuted, fontSize: 10, fontWeight: 500 }}>{"\u2713"}</div>
              <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: i === 3 ? gold : textPrimary, marginBottom: 4 }}>{t.year}</div>
              <div style={{ fontSize: 12, color: textSecondary }}>{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "64px 36px", background: goldBg, textAlign: "center" }}>
        <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 300, color: textPrimary, marginBottom: 12 }}>Quieres conocernos en persona?</div>
        <p style={{ fontSize: 14, color: textSecondary, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>Visitanos en nuestra oficina o contactanos. Estaremos encantados de ayudarte.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onContact} style={{ background: gold, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 24, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Contactanos {"\u2192"}</button>
          <button style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "13px 28px", borderRadius: 24, fontSize: 14, cursor: "pointer" }}>Llamanos</button>
        </div>
      </div>

      <Footer />
      <div style={{ padding: "16px 36px", textAlign: "center" }}>
        <button onClick={onHome} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "10px 24px", borderRadius: 24, fontSize: 12, cursor: "pointer" }}>{"\u2190"} Volver a la Home</button>
      </div>
    </div>
  );
}
