import { useState } from "react";

const gold = "#BA7517";
const gold600 = "#A36614";
const goldBg = "#FAF3E3";
const goldBgHover = "#F5E6C4";
const warmGray = "#F7F5F0";
const textPrimary = "#1A1A18";
const textSecondary = "#6B6A65";
const textMuted = "#9C9B95";
const borderLight = "#E8E6DF";
const charcoal800 = "#2C2C2A";
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', 'Arial', sans-serif";

export default function CasasGroupApp() {
  const [view, setView] = useState("home");
  if (view === "search") return <SearchPage onBack={() => setView("home")} />;
  return <HomePage onSearch={() => setView("search")} />;
}

function HomePage({ onSearch }) {
  const [heroTab, setHeroTab] = useState("comprar");
  const [propFilter, setPropFilter] = useState("Venta");

  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff" }}>

      {/* NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: `0.5px solid ${borderLight}` }}>
        <div style={{ fontFamily: serif, fontSize: 15, letterSpacing: 5 }}>CASAS <span style={{ fontSize: 10, letterSpacing: 3, opacity: 0.6 }}>GROUP</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11, letterSpacing: 0.3 }}>
          {["Comprar", "Alquilar", "Vender", "Servicios", "Nosotros"].map(i => (
            <span key={i} style={{ color: textSecondary, cursor: "pointer" }}>{i}</span>
          ))}
          <span style={{ background: gold, color: "#fff", padding: "7px 16px", borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: "pointer" }}>Valoracion gratuita</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: warmGray }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.1, fontSize: 12, color: textMuted, flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 36, opacity: 0.4 }}>{"\u25A2"}</div>Foto interior premium
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 28px" }}>
          <div style={{ fontFamily: serif, fontSize: 48, letterSpacing: 12, fontWeight: 400 }}>CASAS</div>
          <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: 8, color: textSecondary, marginBottom: 24 }}>G R O U P</div>
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 28px", fontWeight: 300 }}>Tu hogar empieza aqui. Compramos, vendemos y alquilamos con la excelencia que mereces.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 16 }}>
            {["comprar", "alquilar", "vender"].map(tab => (
              <span key={tab} onClick={() => setHeroTab(tab)} style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", paddingBottom: 6, borderBottom: heroTab === tab ? `2px solid ${gold}` : "2px solid transparent", color: heroTab === tab ? textPrimary : textMuted, fontWeight: heroTab === tab ? 500 : 400, transition: "all 0.2s" }}>{tab}</span>
            ))}
          </div>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ display: "flex", background: "#fff", borderRadius: 36, border: `0.5px solid ${borderLight}`, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              <input type="text" placeholder="Ciudad, provincia, barrio o referencia..." disabled style={{ flex: 1, border: "none", padding: "13px 18px", fontSize: 13, background: "transparent", outline: "none", color: textPrimary }} />
              <button onClick={onSearch} style={{ background: gold, color: "#fff", border: "none", padding: "13px 20px", cursor: "pointer", fontSize: 15, borderRadius: "0 36px 36px 0" }}>{"\u2315"}</button>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: textMuted }}>Prefiero hablar con alguien <span style={{ color: gold, cursor: "pointer" }}>Contactar</span> | <span style={{ color: gold, cursor: "pointer" }}>+34 6XX XXX XXX</span></div>
        </div>
      </div>

      {/* SERVICIOS */}
      <div style={{ padding: "40px 28px" }}>
        <div style={{ fontFamily: serif, fontSize: 22, letterSpacing: 1, marginBottom: 4 }}>Nuestros servicios</div>
        <p style={{ fontSize: 13, color: textSecondary, marginBottom: 20 }}>Todo lo que necesitas en un solo lugar</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {[
            { icon: "\u25A3", t: "Administracion de fincas", d: "Gestion integral de tu comunidad con transparencia" },
            { icon: "\u25C6", t: "Hipotecas", d: "Te ayudamos a encontrar la mejor financiacion" },
            { icon: "\u26A1", t: "Cambio de suministros", d: "Luz, gas y seguros — nos encargamos por ti" },
            { icon: "\u25C9", t: "Seguros", d: "Protege tu vivienda con las mejores opciones" },
          ].map((s, i) => (
            <div key={i} style={{ border: `0.5px solid ${borderLight}`, borderRadius: 10, padding: 14, display: "flex", gap: 10, cursor: "pointer" }}>
              <div style={{ fontSize: 18, color: gold, flexShrink: 0 }}>{s.icon}</div>
              <div><div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{s.t}</div><div style={{ fontSize: 11, color: textSecondary, lineHeight: 1.5 }}>{s.d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPRAR / VENDER / ALQUILAR */}
      {["Comprar", "Vender", "Alquilar"].map((title, i) => (
        <div key={i} style={{ position: "relative", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: `0.5px solid ${borderLight}`, cursor: "pointer", overflow: "hidden", background: goldBg }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "38%", background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, opacity: 0.5 }}>Foto premium</div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: "52%" }}>
            <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 400, letterSpacing: 2, marginBottom: 6, color: charcoal800 }}>{title}</div>
          </div>
          <div style={{ position: "relative", zIndex: 1, fontSize: 22, color: gold, marginRight: "40%" }}>{"\u2192"}</div>
        </div>
      ))}

      {/* VALORACION GRATUITA */}
      <div style={{ padding: "40px 28px" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", background: goldBg, borderRadius: 14, padding: 28, border: `0.5px solid ${borderLight}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 20, letterSpacing: 1, marginBottom: 6 }}>Descubre cuanto vale tu vivienda</div>
            <p style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7, marginBottom: 16 }}>Valoracion profesional gratuita y sin compromiso, basada en datos reales de tu zona.</p>
            <button style={{ background: gold, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 24, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Solicitar valoracion gratuita {"\u2192"}</button>
          </div>
          <div style={{ width: 180, height: 130, background: "#fff", borderRadius: 10, border: `0.5px solid ${borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, textAlign: "center", flexShrink: 0 }}>Ilustracion o foto</div>
        </div>
      </div>

      {/* POR QUE ELEGIRNOS */}
      <div style={{ padding: "40px 28px", background: warmGray }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: serif, fontSize: 22, letterSpacing: 1, marginBottom: 4 }}>Por que elegirnos</div>
          <p style={{ fontSize: 13, color: textSecondary, fontStyle: "italic" }}>No venimos a ser uno mas. Venimos a ser los mejores.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
          {[
            { icon: "\u2605", t: "Excelencia en cada detalle", d: "Cuidamos cada paso para que tu experiencia sea impecable" },
            { icon: "\u2661", t: "Trato cercano y personal", d: "Personas que entienden lo que necesitas" },
            { icon: "\u2302", t: "Conocimiento local real", d: "Especialistas con datos reales de mercado" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 6 }}>
              <div style={{ fontSize: 26, color: gold, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{item.t}</div>
              <div style={{ fontSize: 11, color: textSecondary, lineHeight: 1.6 }}>{item.d}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: borderLight, borderRadius: 10, overflow: "hidden" }}>
          {[{ n: "+150", l: "Operaciones" }, { n: "98%", l: "Satisfaccion" }, { n: "45", l: "Dias venta media" }, { n: "+10", l: "Anos experiencia" }].map((s, i) => (
            <div key={i} style={{ background: "#fff", textAlign: "center", padding: "16px 6px" }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: gold }}>{s.n}</div>
              <div style={{ fontSize: 10, color: textSecondary, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NOSOTROS */}
      <div style={{ padding: "40px 28px" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ width: 240, height: 170, background: warmGray, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted, textAlign: "center", flexShrink: 0, border: `0.5px solid ${borderLight}` }}>Foto del equipo</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 20, letterSpacing: 1, marginBottom: 10 }}>Casas Group</div>
            <p style={{ fontFamily: serif, fontSize: 14, fontStyle: "italic", color: textSecondary, lineHeight: 1.7, marginBottom: 10 }}>"Porque entendimos que el sector no necesitaba mas de lo mismo. Necesitaba algo diferente."</p>
            <p style={{ fontSize: 12, color: textSecondary, lineHeight: 1.6, marginBottom: 14 }}>Una marca pensada para superar expectativas y cuidar cada detalle con excelencia.</p>
            <div style={{ fontSize: 12, color: gold, cursor: "pointer" }}>Conocenos {"\u2192"}</div>
          </div>
        </div>
      </div>

      {/* ULTIMAS PROPIEDADES */}
      <div style={{ padding: "40px 28px", background: warmGray }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: serif, fontSize: 22, letterSpacing: 1, marginBottom: 4 }}>Ultimas propiedades</div>
            <p style={{ fontSize: 12, color: textSecondary }}>Seleccion de inmuebles disponibles</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Venta", "Alquiler"].map((pill) => (
              <span key={pill} onClick={() => setPropFilter(pill)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", border: `1px solid ${propFilter === pill ? gold : borderLight}`, background: propFilter === pill ? gold : "#fff", color: propFilter === pill ? "#fff" : textSecondary, transition: "all 0.2s" }}>{pill}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {[
            { zone: "Esplugues", title: "Piso reformado con terraza", beds: 3, baths: 2, m2: 95, price: "285.000 \u20ac", tag: "Nuevo" },
            { zone: "Sant Just Desvern", title: "Casa adosada con jardin", beds: 4, baths: 2, m2: 180, price: "520.000 \u20ac", tag: null },
            { zone: "Cornella", title: "Atico con vistas", beds: 2, baths: 1, m2: 72, price: "320.000 \u20ac", tag: null },
          ].map((p, i) => (
            <div key={i} style={{ background: "#fff", border: `0.5px solid ${borderLight}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ height: 130, background: "#EFEDE8", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: textMuted }}>
                Foto propiedad
                {p.tag && <span style={{ position: "absolute", top: 8, left: 8, background: gold, color: "#fff", fontSize: 9, padding: "3px 10px", borderRadius: 10, fontWeight: 500 }}>{p.tag}</span>}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 10, color: gold, letterSpacing: 0.5, marginBottom: 3 }}>{p.zone}</div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{p.title}</div>
                <div style={{ display: "flex", gap: 8, fontSize: 10, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} banos</span><span>{p.m2} m{"\u00b2"}</span></div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: gold, cursor: "pointer" }}>Ver todas las propiedades {"\u2192"}</div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: 28, background: textPrimary, color: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: 5, marginBottom: 6 }}>CASAS GROUP</div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 10 }}>Tu hogar empieza aqui.</p>
            <div style={{ display: "flex", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.35)" }}><span>IG</span><span>FB</span><span>LI</span></div>
          </div>
          {[
            { t: "Inmuebles", l: ["Comprar", "Alquilar", "Mapa interactivo"] },
            { t: "Servicios", l: ["Vender", "Administracion", "Hipotecas", "Suministros"] },
            { t: "Empresa", l: ["Nosotros", "Contacto", "Aviso legal", "Privacidad"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, marginBottom: 10, color: "rgba(255,255,255,0.3)" }}>{col.t}</div>
              {col.l.map((link, j) => <div key={j} style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 7, cursor: "pointer" }}>{link}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: 14, fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>2026 Casas Group. Todos los derechos reservados.</div>
      </div>

      <div style={{ padding: "16px 28px", textAlign: "center" }}>
        <button onClick={onSearch} style={{ background: gold, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 24, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Ver pantalla de busqueda {"\u2192"}</button>
      </div>
    </div>
  );
}

function SearchPage({ onBack }) {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const properties = [
    { zone: "Eixample", title: "Piso reformado luminoso", beds: 3, baths: 2, m2: 95, price: "385.000 \u20ac", img: "Salon con parquet" },
    { zone: "Gracia", title: "Atico con terraza privada", beds: 2, baths: 1, m2: 68, price: "295.000 \u20ac", img: "Terraza con vistas" },
    { zone: "Sant Marti", title: "Piso a estrenar", beds: 4, baths: 2, m2: 110, price: "450.000 \u20ac", img: "Cocina nueva" },
    { zone: "Sants", title: "Estudio con balcon", beds: 1, baths: 1, m2: 42, price: "175.000 \u20ac", img: "Estudio luminoso" },
    { zone: "Poble Sec", title: "Piso con encanto", beds: 2, baths: 1, m2: 65, price: "260.000 \u20ac", img: "Dormitorio amplio" },
    { zone: "Les Corts", title: "Duplex con parking", beds: 3, baths: 2, m2: 120, price: "510.000 \u20ac", img: "Salon doble altura" },
  ];

  const pins = [
    { price: "385k", top: "22%", left: "40%" },
    { price: "295k", top: "35%", left: "60%" },
    { price: "450k", top: "50%", left: "28%" },
    { price: "175k", top: "30%", left: "72%" },
    { price: "260k", top: "60%", left: "50%" },
    { price: "510k", top: "45%", left: "18%" },
  ];

  return (
    <div style={{ fontFamily: sans, color: textPrimary, maxWidth: 860, margin: "0 auto", background: "#fff", position: "relative" }}>

      {/* NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: `0.5px solid ${borderLight}` }}>
        <div onClick={onBack} style={{ fontFamily: serif, fontSize: 13, letterSpacing: 4, cursor: "pointer" }}>CASAS <span style={{ fontSize: 9, letterSpacing: 3, opacity: 0.6 }}>GROUP</span></div>
        <div style={{ display: "flex", background: warmGray, borderRadius: 24, padding: "8px 16px", gap: 12, alignItems: "center", flex: 1, maxWidth: 360, margin: "0 20px" }}>
          <span style={{ fontSize: 14 }}>{"\u2315"}</span>
          <span style={{ fontSize: 12, color: textSecondary }}>Barcelona</span>
          <span style={{ fontSize: 12, color: textMuted }}>|</span>
          <span style={{ fontSize: 11, color: gold, fontWeight: 500 }}>Compra</span>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 11, color: textSecondary, alignItems: "center" }}>
          {["Comprar", "Alquilar", "Vender"].map(i => <span key={i} style={{ cursor: "pointer" }}>{i}</span>)}
          <span style={{ background: gold, color: "#fff", padding: "5px 12px", borderRadius: 16, fontSize: 10 }}>Valoracion gratuita</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: `0.5px solid ${borderLight}`, flexWrap: "wrap", alignItems: "center" }}>
        <div onClick={() => setShowFilters(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: `1px solid ${textSecondary}`, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
          <span style={{ fontSize: 13 }}>{"\u2630"}</span> Filtros
        </div>

        {/* Compra already selected */}
        <span style={{ padding: "7px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: `1px solid ${gold}`, background: goldBg, color: gold, fontWeight: 500 }}>Compra {"\u2715"}</span>

        {["Precio", "Habitaciones", "Banos", "Superficie", "Tipo"].map((f, i) => (
          <span key={i} style={{ padding: "7px 14px", borderRadius: 20, border: `0.5px solid ${borderLight}`, fontSize: 11, color: textSecondary, cursor: "pointer" }}>{f}</span>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <span onClick={() => setViewMode("grid")} style={{ padding: "6px 10px", borderRadius: 6, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", background: viewMode === "grid" ? warmGray : "#fff" }}>{"\u2637"}</span>
          <span onClick={() => setViewMode("list")} style={{ padding: "6px 10px", borderRadius: 6, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", background: viewMode === "list" ? warmGray : "#fff" }}>{"\u2630"}</span>
        </div>
      </div>

      {/* SPLIT: RESULTS + MAP */}
      <div style={{ display: "flex", minHeight: 560 }}>

        {/* LEFT: Results */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto", borderRight: `0.5px solid ${borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>24 inmuebles en Barcelona</div>
              <div style={{ fontSize: 11, color: textMuted }}>Compra</div>
            </div>
            <div style={{ fontSize: 11, color: textSecondary }}>Ordenar: Mas recientes</div>
          </div>

          {viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              {properties.map((p, i) => (
                <div key={i} style={{ border: `0.5px solid ${borderLight}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ height: 100, background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted, position: "relative" }}>
                    {p.img}
                    <div style={{ position: "absolute", top: 6, right: 6, fontSize: 14, color: textMuted, opacity: 0.4 }}>{"\u2661"}</div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 9, color: gold, letterSpacing: 0.5, marginBottom: 2 }}>{p.zone}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 6, fontSize: 10, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} ba</span><span>{p.m2} m{"\u00b2"}</span></div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 6 }}>{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {properties.map((p, i) => (
                <div key={i} style={{ display: "flex", border: `0.5px solid ${borderLight}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ width: 140, background: warmGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: textMuted, flexShrink: 0 }}>{p.img}</div>
                  <div style={{ padding: 12, flex: 1 }}>
                    <div style={{ fontSize: 9, color: gold, letterSpacing: 0.5, marginBottom: 2 }}>{p.zone}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 10, color: textSecondary }}><span>{p.beds} hab</span><span>{p.baths} ba</span><span>{p.m2} m{"\u00b2"}</span></div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginTop: 6 }}>{p.price}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, color: textMuted, opacity: 0.4 }}>{"\u2661"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: MAP */}
        <div style={{ width: "45%", background: warmGray, position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", fontSize: 11, color: textMuted }}>
            <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.3 }}>{"\u2691"}</div>
            Mapa interactivo<br />Google Maps<br /><span style={{ fontSize: 10 }}>Se actualiza al mover</span>
          </div>
          {pins.map((pin, i) => (
            <div key={i} style={{ position: "absolute", top: pin.top, left: pin.left, background: "#fff", border: `1px solid ${borderLight}`, borderRadius: 6, padding: "4px 8px", fontSize: 10, fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = textPrimary; }}>
              {pin.price}
            </div>
          ))}
        </div>
      </div>

      {/* FILTER MODAL WITH OVERLAY */}
      {showFilters && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Overlay */}
          <div onClick={() => setShowFilters(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} />

          {/* Modal */}
          <div style={{ position: "relative", background: "#fff", borderRadius: 14, width: "90%", maxWidth: 540, maxHeight: "80vh", overflow: "auto", boxShadow: "0 12px 48px rgba(0,0,0,0.12)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: `0.5px solid ${borderLight}`, position: "sticky", top: 0, background: "#fff", zIndex: 1, borderRadius: "14px 14px 0 0" }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Filtros</span>
              <span onClick={() => setShowFilters(false)} style={{ fontSize: 20, color: textMuted, cursor: "pointer", lineHeight: 1 }}>{"\u2715"}</span>
            </div>

            <div style={{ padding: 24 }}>
              {/* Precio */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Precio</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>Minimo</div>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>Maximo</div>
                </div>
              </div>

              {/* Categoria */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Categoria</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Piso", "Chalet", "Local", "Parking"].map((c, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 20, border: `0.5px solid ${i === 0 ? gold : borderLight}`, fontSize: 12, cursor: "pointer", background: i === 0 ? goldBg : "#fff", color: i === 0 ? gold : textSecondary, fontWeight: i === 0 ? 500 : 400 }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Estado</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["En venta", "En alquiler", "Opcion compra"].map((c, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 20, border: `0.5px solid ${i === 0 ? gold : borderLight}`, fontSize: 12, cursor: "pointer", background: i === 0 ? goldBg : "#fff", color: i === 0 ? gold : textSecondary, fontWeight: i === 0 ? 500 : 400 }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Dormitorios */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Dormitorios</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Cualquier", "1+", "2+", "3+", "4+"].map((c, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 20, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", color: textSecondary }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Banos */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Banos</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Cualquier", "1+", "2+", "3+", "4+"].map((c, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: 20, border: `0.5px solid ${borderLight}`, fontSize: 12, cursor: "pointer", color: textSecondary }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Superficie */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Superficie</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>Min m{"\u00b2"}</div>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>Max m{"\u00b2"}</div>
                </div>
              </div>

              {/* Rango dormitorios */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Rango dormitorios</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>No min</div>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>No max</div>
                </div>
              </div>

              {/* Rango banos */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Rango banos</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>No min</div>
                  <div style={{ flex: 1, border: `0.5px solid ${borderLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 13, color: textMuted }}>No max</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: `0.5px solid ${borderLight}`, position: "sticky", bottom: 0, background: "#fff", borderRadius: "0 0 14px 14px" }}>
              <span style={{ fontSize: 13, color: textSecondary, cursor: "pointer", textDecoration: "underline" }}>Quitar filtros</span>
              <button onClick={() => setShowFilters(false)} style={{ background: gold, color: "#fff", border: "none", padding: "11px 24px", borderRadius: 24, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Mostrar 24 inmuebles</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 20px", textAlign: "center", borderTop: `0.5px solid ${borderLight}` }}>
        <button onClick={onBack} style={{ background: "transparent", color: gold, border: `1px solid ${gold}`, padding: "10px 24px", borderRadius: 24, fontSize: 12, cursor: "pointer" }}>{"\u2190"} Volver a la Home</button>
      </div>
    </div>
  );
}
