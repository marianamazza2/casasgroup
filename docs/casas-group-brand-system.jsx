import { useState } from "react";

export default function BrandSystem() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", color: "#1A1A18", maxWidth: 860, margin: "0 auto", lineHeight: 1.6 }}>

      {/* COVER */}
      <div style={{ background: "#FAFAF7", padding: "60px 48px", textAlign: "center", borderBottom: "0.5px solid #E8E6DF" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 42, letterSpacing: 10, fontWeight: 400, marginBottom: 4 }}>CASAS</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, letterSpacing: 8, color: "#6B6A65", marginBottom: 32 }}>G R O U P</div>
        <div style={{ width: 40, height: 1, background: "#BA7517", margin: "0 auto 32px" }} />
        <div style={{ fontSize: 13, letterSpacing: 3, color: "#9C9B95", textTransform: "uppercase" }}>Sistema de diseno y manual de marca</div>
        <div style={{ fontSize: 11, color: "#9C9B95", marginTop: 8 }}>Version 1.0 — Mayo 2026</div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 1. ESENCIA DE MARCA */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>01</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Esencia de marca</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Posicionamiento</div>
            <p style={{ fontSize: 13, color: "#6B6A65", lineHeight: 1.7 }}>
              Casas Group es una inmobiliaria premium local que combina la excelencia del servicio de lujo con la cercanía y el trato familiar. No es un portal masivo ni una franquicia fría — es una marca con ambición que cuida cada detalle.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Territorio visual</div>
            <p style={{ fontSize: 13, color: "#6B6A65", lineHeight: 1.7 }}>
              Quiet luxury. Editorial refinado. La marca habla a través del espacio en blanco, la tipografía con peso y la fotografía cálida. Evita lo recargado, lo tecnológico, lo genérico. Cada pieza debe sentirse como una revista de interiorismo, no como un portal inmobiliario.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
          {["Elegante pero accesible", "Minimalista pero calida", "Ambiciosa pero cercana", "Premium pero familiar"].map((v, i) => (
            <div key={i} style={{ padding: "14px 12px", background: "#FAFAF7", borderRadius: 8, textAlign: "center", fontSize: 12, color: "#6B6A65", lineHeight: 1.5 }}>{v}</div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 2. PALETA DE COLORES */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px", background: "#FAFAF7" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>02</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Paleta de colores</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 32 }} />

        {/* Primary */}
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, letterSpacing: 0.5 }}>Colores primarios</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 8 }}>
          {[
            { hex: "#BA7517", name: "Gold 500", role: "Principal de marca" },
            { hex: "#D4A853", name: "Gold 400", role: "Hover / acentos suaves" },
            { hex: "#E8C878", name: "Gold 300", role: "Fondos destacados" },
            { hex: "#F5E6C4", name: "Gold 100", role: "Fondos sutiles / cards" },
            { hex: "#FAF3E3", name: "Gold 50", role: "Fondo seccion calida" },
          ].map((c, i) => (
            <div key={i}>
              <div style={{ height: 56, background: c.hex, borderRadius: 8, marginBottom: 6 }} />
              <div style={{ fontSize: 11, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "#9C9B95" }}>{c.hex}</div>
              <div style={{ fontSize: 10, color: "#6B6A65", marginTop: 2 }}>{c.role}</div>
            </div>
          ))}
        </div>

        {/* Neutrals */}
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, marginTop: 28, letterSpacing: 0.5 }}>Neutros</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
          {[
            { hex: "#1A1A18", name: "Charcoal 900", role: "Texto principal" },
            { hex: "#2C2C2A", name: "Charcoal 800", role: "Titulos / footer" },
            { hex: "#6B6A65", name: "Charcoal 500", role: "Texto secundario" },
            { hex: "#9C9B95", name: "Charcoal 300", role: "Texto terciario / hints" },
            { hex: "#E8E6DF", name: "Sand 200", role: "Bordes / separadores" },
            { hex: "#F7F5F0", name: "Sand 100", role: "Fondo secundario" },
            { hex: "#FAFAF7", name: "Sand 50", role: "Fondo pagina" },
          ].map((c, i) => (
            <div key={i}>
              <div style={{ height: 48, background: c.hex, borderRadius: 6, marginBottom: 6, border: i > 4 ? "0.5px solid #E8E6DF" : "none" }} />
              <div style={{ fontSize: 10, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 9, color: "#9C9B95" }}>{c.hex}</div>
              <div style={{ fontSize: 9, color: "#6B6A65", marginTop: 2 }}>{c.role}</div>
            </div>
          ))}
        </div>

        {/* Semantic */}
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, marginTop: 28, letterSpacing: 0.5 }}>Semanticos (uso funcional)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { hex: "#1B7A4A", name: "Success", role: "Confirmaciones, disponible" },
            { hex: "#C43D2E", name: "Error", role: "Errores, validaciones" },
            { hex: "#D97B0D", name: "Warning", role: "Alertas, avisos" },
            { hex: "#2A6FB5", name: "Info", role: "Enlaces, informacion" },
          ].map((c, i) => (
            <div key={i}>
              <div style={{ height: 40, background: c.hex, borderRadius: 6, marginBottom: 6 }} />
              <div style={{ fontSize: 10, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 9, color: "#9C9B95" }}>{c.hex}</div>
              <div style={{ fontSize: 9, color: "#6B6A65", marginTop: 2 }}>{c.role}</div>
            </div>
          ))}
        </div>

        {/* Color usage rules */}
        <div style={{ marginTop: 28, padding: 20, background: "#fff", borderRadius: 10, border: "0.5px solid #E8E6DF" }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>Reglas de uso del color</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12, color: "#6B6A65", lineHeight: 1.6 }}>
            <div>
              <span style={{ fontWeight: 500, color: "#1A1A18" }}>Gold 500</span> es el unico color de marca. Se usa en CTAs primarios, iconografia, links activos, badges, y la linea del underline en tabs. Nunca como fondo de secciones grandes.
            </div>
            <div>
              <span style={{ fontWeight: 500, color: "#1A1A18" }}>Gold 50–100</span> se usan como fondos calidos para secciones o cards que necesiten diferenciarse del blanco puro (ej: seccion "Vender", banner de valoracion).
            </div>
            <div>
              <span style={{ fontWeight: 500, color: "#1A1A18" }}>Charcoal 900</span> para texto principal y titulos. Nunca negro puro (#000) — el charcoal es mas calido y coherente con la marca.
            </div>
            <div>
              <span style={{ fontWeight: 500, color: "#1A1A18" }}>Sand 100–200</span> para fondos de seccion alternos, bordes y separadores. Estos crean la sensacion de calidez sin recurrir a color.
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 3. TIPOGRAFIA */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>03</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Tipografia</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 32 }} />

        {/* Font pairing */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
          <div style={{ padding: 24, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#9C9B95", marginBottom: 12, textTransform: "uppercase" }}>Display / Titulos</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 400, letterSpacing: 2, marginBottom: 8 }}>Bodoni Moda</div>
            <p style={{ fontSize: 12, color: "#6B6A65", lineHeight: 1.6 }}>
              Serif de alto contraste con trazos finos y elegantes. Se usa para el logo, titulos de seccion, claims, y los accesos grandes (Comprar, Vender, Alquilar). Siempre en peso Regular (400) o Medium (500), nunca Bold.
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: "#9C9B95" }}>Google Fonts: Bodoni Moda</div>
            <div style={{ fontSize: 11, color: "#9C9B95" }}>Alternativa: Cormorant Garamond</div>
          </div>
          <div style={{ padding: 24, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#9C9B95", marginBottom: 12, textTransform: "uppercase" }}>Cuerpo / UI</div>
            <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 28, fontWeight: 300, letterSpacing: 0.5, marginBottom: 8 }}>DM Sans</div>
            <p style={{ fontSize: 12, color: "#6B6A65", lineHeight: 1.6 }}>
              Sans-serif geometrica, limpia y moderna. Se usa para cuerpo de texto, navegacion, filtros, cards de inmuebles, formularios y toda la interfaz funcional. Pesos: Light (300), Regular (400) y Medium (500).
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: "#9C9B95" }}>Google Fonts: DM Sans</div>
            <div style={{ fontSize: 11, color: "#9C9B95" }}>Alternativa: Plus Jakarta Sans</div>
          </div>
        </div>

        {/* Type scale */}
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16, letterSpacing: 0.5 }}>Escala tipografica</div>
        <div style={{ background: "#FAFAF7", borderRadius: 10, overflow: "hidden" }}>
          {[
            { name: "Display XL", font: "Georgia, serif", size: 48, weight: 400, spacing: "10px", use: "Logo en hero, nombre de marca" },
            { name: "Display L", font: "Georgia, serif", size: 40, weight: 400, spacing: "2px", use: "Comprar / Vender / Alquilar (seccion grande)" },
            { name: "Heading 1", font: "Georgia, serif", size: 24, weight: 400, spacing: "1px", use: "Titulos de seccion" },
            { name: "Heading 2", font: "Georgia, serif", size: 20, weight: 400, spacing: "0.5px", use: "Subtitulos, cards de servicio" },
            { name: "Heading 3", font: "Georgia, serif", size: 16, weight: 400, spacing: "0.5px", use: "Titulos menores, quotes" },
            { name: "Body L", font: "'Helvetica Neue', sans-serif", size: 15, weight: 300, spacing: "0", use: "Claim del hero, textos destacados" },
            { name: "Body M", font: "'Helvetica Neue', sans-serif", size: 13, weight: 400, spacing: "0", use: "Texto de parrafo, descripciones" },
            { name: "Body S", font: "'Helvetica Neue', sans-serif", size: 12, weight: 400, spacing: "0", use: "Cards, meta info, filtros" },
            { name: "Caption", font: "'Helvetica Neue', sans-serif", size: 11, weight: 400, spacing: "0.3px", use: "Labels, hints, pill text" },
            { name: "Overline", font: "'Helvetica Neue', sans-serif", size: 10, weight: 500, spacing: "1.5px", use: "Categorias, zonas, labels uppercase" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "12px 20px", borderBottom: i < 9 ? "0.5px solid #E8E6DF" : "none" }}>
              <div style={{ width: 80, fontSize: 10, color: "#9C9B95", flexShrink: 0 }}>{t.name}</div>
              <div style={{ fontFamily: t.font, fontSize: Math.min(t.size, 28), fontWeight: t.weight, letterSpacing: t.spacing, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.size}px / {t.weight} / {t.spacing}
              </div>
              <div style={{ fontSize: 10, color: "#6B6A65", flexShrink: 0, textAlign: "right", maxWidth: 200 }}>{t.use}</div>
            </div>
          ))}
        </div>

        {/* Typography rules */}
        <div style={{ marginTop: 24, padding: 20, background: "#FAFAF7", borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>Reglas tipograficas</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12, color: "#6B6A65", lineHeight: 1.6 }}>
            <div>La serif (Bodoni Moda) SOLO para titulos y elementos de marca. Nunca para cuerpo de texto, formularios ni UI funcional.</div>
            <div>El tracking amplio (letter-spacing alto) solo en el logo y en labels uppercase tipo "OVERLINE". No aplicar a texto de lectura normal.</div>
            <div>Nunca Bold (700) en la serif — el contraste grueso/fino ya da peso visual suficiente. Regular (400) o Medium (500) como maximo.</div>
            <div>La seccion Comprar / Vender / Alquilar usa Display L (40px serif) en color Charcoal 800 (#2C2C2A) — las tres iguales, consistente.</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 4. COMPONENTES Y CTAs */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px", background: "#FAFAF7" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>04</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Botones y CTAs</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 32 }} />

        {/* CTA Primary */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16 }}>CTA Primario</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <div style={{ background: "#BA7517", color: "#fff", padding: "12px 24px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center" }}>
              Base — Gold 500
            </div>
            <div style={{ background: "#A36614", color: "#fff", padding: "12px 24px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center" }}>
              Hover — Gold 600
            </div>
            <div style={{ background: "#8B5610", color: "#fff", padding: "12px 24px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center", transform: "scale(0.98)" }}>
              Active — Gold 700
            </div>
            <div style={{ background: "#BA7517", color: "#fff", padding: "12px 24px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center", opacity: 0.4 }}>
              Disabled
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.6 }}>
            Fondo Gold 500 (#BA7517), texto blanco, border-radius 24px (pill shape), padding 12px 24px, font-size 13px DM Sans Medium (500). Hover oscurece a #A36614. Active a #8B5610 con scale(0.98). Disabled opacity 0.4. Transicion: all 0.2s ease.
          </div>
        </div>

        {/* CTA Secondary */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16 }}>CTA Secundario</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <div style={{ background: "transparent", color: "#BA7517", padding: "11px 23px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center", border: "1px solid #BA7517" }}>
              Base — Outline Gold
            </div>
            <div style={{ background: "#FAF3E3", color: "#BA7517", padding: "11px 23px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center", border: "1px solid #BA7517" }}>
              Hover — Gold 50 fill
            </div>
            <div style={{ background: "#F5E6C4", color: "#A36614", padding: "11px 23px", borderRadius: 24, fontSize: 13, fontWeight: 500, textAlign: "center", border: "1px solid #A36614", transform: "scale(0.98)" }}>
              Active
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.6 }}>
            Borde Gold 500, fondo transparente, texto Gold 500. Hover rellena con Gold 50 (#FAF3E3). Active rellena Gold 100 y oscurece texto/borde. Se usa para acciones secundarias: "Ver todas las propiedades", "Conocenos", "Volver".
          </div>
        </div>

        {/* CTA Ghost / Link */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16 }}>Link / Ghost</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "#BA7517", cursor: "pointer" }}>
              Ver todas las propiedades &#8594;
            </div>
            <div style={{ fontSize: 13, color: "#A36614", cursor: "pointer", textDecoration: "underline" }}>
              Hover — underline + darken
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.6 }}>
            Texto Gold 500, sin borde ni fondo. Hover oscurece a Gold 600 y anade underline. Se usa para enlaces en linea, "Ver mas", "Conocenos", navegacion del footer.
          </div>
        </div>

        {/* Pills / Tags */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16 }}>Pills y filtros</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <span style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#BA7517", color: "#fff" }}>Activo</span>
            <span style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, border: "0.5px solid #E8E6DF", color: "#6B6A65" }}>Inactivo</span>
            <span style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, border: "0.5px solid #BA7517", background: "#FAF3E3", color: "#BA7517" }}>Seleccionado (filtro)</span>
            <span style={{ padding: "4px 10px", borderRadius: 10, fontSize: 9, fontWeight: 500, background: "#BA7517", color: "#fff" }}>Badge (Nuevo)</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.6 }}>
            Pills de filtro: border Sand 200, texto Charcoal 500. Estado activo: fondo Gold 500, texto blanco. Estado seleccionado en modales: borde Gold, fondo Gold 50, texto Gold. Badges: Gold 500 con texto blanco, font-size 9px.
          </div>
        </div>

        {/* Tabs */}
        {/* Las tres idénticas. Base Gold 50, hover Gold 100, texto Charcoal 800, flecha Gold 500 */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 16 }}>Tabs (hero)</div>
          <div style={{ display: "flex", gap: 32, marginBottom: 12, borderBottom: "1px solid #E8E6DF", paddingBottom: 0 }}>
            <span style={{ paddingBottom: 10, borderBottom: "2px solid #BA7517", fontSize: 12, letterSpacing: 1.5, fontWeight: 500, color: "#1A1A18" }}>COMPRAR</span>
            <span style={{ paddingBottom: 10, borderBottom: "2px solid transparent", fontSize: 12, letterSpacing: 1.5, color: "#9C9B95" }}>ALQUILAR</span>
            <span style={{ paddingBottom: 10, borderBottom: "2px solid transparent", fontSize: 12, letterSpacing: 1.5, color: "#9C9B95" }}>VENDER</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.6 }}>
            Tab activo: texto Charcoal 900, weight 500, underline 2px Gold 500. Tab inactivo: texto Charcoal 300, sin underline. Uppercase, letter-spacing 1.5px, DM Sans. Transicion del underline: 0.2s ease.
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 5. COMPONENTES UI */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>05</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Componentes UI</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 32 }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Search bar */}
          <div style={{ padding: 20, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 12 }}>Barra de busqueda</div>
            <div style={{ display: "flex", background: "#fff", borderRadius: 36, border: "0.5px solid #E8E6DF", overflow: "hidden" }}>
              <div style={{ flex: 1, padding: "12px 16px", fontSize: 12, color: "#9C9B95" }}>Ciudad, zona o codigo postal...</div>
              <div style={{ background: "#BA7517", color: "#fff", padding: "12px 18px", borderRadius: "0 36px 36px 0", fontSize: 14 }}>&#8981;</div>
            </div>
            <div style={{ fontSize: 10, color: "#6B6A65", marginTop: 8, lineHeight: 1.5 }}>Fondo blanco, border Sand 200, pill radius 36px. Boton de busqueda Gold 500. Shadow: 0 2px 16px rgba(0,0,0,0.04)</div>
          </div>

          {/* Property card */}
          <div style={{ padding: 20, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 12 }}>Card de propiedad</div>
            <div style={{ background: "#fff", border: "0.5px solid #E8E6DF", borderRadius: 12, overflow: "hidden", maxWidth: 200 }}>
              <div style={{ height: 80, background: "#EFEDE8", position: "relative" }}>
                <span style={{ position: "absolute", top: 6, left: 6, background: "#BA7517", color: "#fff", fontSize: 8, padding: "2px 7px", borderRadius: 8 }}>Nuevo</span>
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 9, color: "#BA7517", letterSpacing: 0.5, marginBottom: 2 }}>Esplugues</div>
                <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>Piso reformado</div>
                <div style={{ fontSize: 9, color: "#6B6A65" }}>3 hab  2 ba  95 m2</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>285.000 &#8364;</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#6B6A65", marginTop: 8, lineHeight: 1.5 }}>Border Sand 200, radius 12px. Zona en Gold 500 overline. Precio en Charcoal 900 Medium.</div>
          </div>

          {/* Input fields */}
          <div style={{ padding: 20, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 12 }}>Campos de formulario</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#6B6A65", marginBottom: 4 }}>Nombre</div>
              <div style={{ border: "0.5px solid #E8E6DF", borderRadius: 8, padding: "10px 12px", fontSize: 12, background: "#fff" }}>Maria Garcia</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#6B6A65", marginBottom: 4 }}>Telefono</div>
              <div style={{ border: "1px solid #BA7517", borderRadius: 8, padding: "10px 12px", fontSize: 12, background: "#fff" }}>+34 612...</div>
            </div>
            <div style={{ fontSize: 10, color: "#6B6A65", marginTop: 8, lineHeight: 1.5 }}>Default: border Sand 200. Focus: border Gold 500 (1px). Error: border #C43D2E. Radius 8px.</div>
          </div>

          {/* Spacing & radius */}
          <div style={{ padding: 20, background: "#FAFAF7", borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 12 }}>Espaciado y radios</div>
            <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.8 }}>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Secciones:</span> padding 40–48px vertical</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Cards:</span> padding 12–16px, gap 12–16px</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Radius S:</span> 6px (badges)</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Radius M:</span> 8–10px (inputs, cards pequenas)</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Radius L:</span> 12px (cards, modales)</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Radius XL:</span> 24–36px (pills, buscador)</div>
              <div><span style={{ fontWeight: 500, color: "#1A1A18" }}>Bordes:</span> 0.5px solid Sand 200 (siempre)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 6. SECCION GRANDE - COLOR DEFINITIVO */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 32px", background: "#FAFAF7" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>06</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Seccion Comprar / Vender / Alquilar</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 32 }} />

        <p style={{ fontSize: 13, color: "#6B6A65", lineHeight: 1.7, marginBottom: 24 }}>
          Las tres palabras usan el mismo color: Charcoal 800 (#2C2C2A). Es un gris oscuro calido que tiene presencia sin competir con el dorado de la marca. Sobre fondo blanco o Sand 50 transmite solidez y elegancia. El dorado queda reservado para CTAs y acentos — si los titulos fueran dorados, se perderia la jerarquia.
        </p>

        <div style={{ borderRadius: 12, overflow: "hidden", border: "0.5px solid #E8E6DF" }}>
          {["Comprar", "Vender", "Alquilar"].map((t, i) => (
            <div key={i} style={{ padding: "28px 36px", borderBottom: i < 2 ? "0.5px solid #E8E6DF" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", background: i === 1 ? "#FAF3E3" : "#fff" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 400, letterSpacing: 2, color: "#2C2C2A" }}>{t}</div>
              <div style={{ fontSize: 18, color: "#9C9B95" }}>&#8594;</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: "#6B6A65" }}>
          Bodoni Moda 40px, Regular (400), letter-spacing 2px, color #2C2C2A. "Vender" con fondo Gold 50 (#FAF3E3) para destacar como servicio estrella.
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* 7. FOTOGRAFIA */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ padding: "48px 48px 48px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#BA7517", marginBottom: 8, textTransform: "uppercase" }}>07</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, marginBottom: 16 }}>Direccion fotografica</div>
        <div style={{ width: 30, height: 1, background: "#E8E6DF", marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Luz natural calida", desc: "Siempre. Nunca flash directo ni iluminacion fria/azulada" },
            { label: "Tonos beige y madera", desc: "Coherente con las publicaciones de Instagram y el branding calido" },
            { label: "Espacios ordenados", desc: "Home staging impecable. Sin desorden, sin objetos personales visibles" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#FAFAF7", borderRadius: 10, padding: 16 }}>
              <div style={{ height: 80, background: "#EFEDE8", borderRadius: 6, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#9C9B95" }}>Ejemplo</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: "#6B6A65", lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, background: "#FAFAF7", borderRadius: 10, fontSize: 12, color: "#6B6A65", lineHeight: 1.6 }}>
          Las fotos de propiedades deben mantener una gama cromatica coherente: blancos calidos, beiges, maderas claras, toques verdes de plantas. Evitar filtros saturados, HDR agresivo o fotografias con tonos frios. La referencia directa es el estilo del post de Instagram "Vendido Esplugues" que compartio Angie.
        </div>
      </div>

    </div>
  );
}
