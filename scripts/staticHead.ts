// ─────────────────────────────────────────────────────────────────────────────
// Plugin de Vite: un HTML por ruta con su <head> ya escrito (SEO sin prerender)
//
// Problema: la web es una SPA. Todas las URLs servían el mismo index.html, sin
// <title> ni description (los pone React al cargar), y con status 200 incluso
// para URLs que no existen. Google acababa indexando fichas borradas
// (/propiedades/102…) con el título "Propiedad no encontrada", y los previews de
// WhatsApp/Facebook (que no ejecutan JS) no veían ninguna meta.
//
// Al terminar `vite build` este plugin:
//   1. Escribe dist/<ruta>.html para cada página estática y cada inmueble
//      publicado, copiando el shell e inyectando title, description, canonical
//      y Open Graph. Con `cleanUrls` (vercel.json) /vender sirve vender.html.
//   2. Escribe dist/404.html (noindex). Vercel lo sirve con status 404 real para
//      cualquier URL sin fichero — ya no hay rewrite catch-all. La SPA arranca
//      igual y pinta la pantalla de 404 / "Propiedad no encontrada".
//
// Las etiquetas llevan `data-static-head`: main.tsx las borra antes de montar
// React para que <HeadContent /> y <Seo> no convivan con duplicados.
//
// Es un plugin y no un script .mjs porque vite.config.ts se compila con TS:
// así importa directamente pageMeta.ts y generatedProperties.ts (que
// buildData.mjs regenera justo antes de `vite build`) sin duplicar textos.
// ─────────────────────────────────────────────────────────────────────────────
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'
import { PAGE_META, propertySeo, type StaticPagePath } from '../src/lib/pageMeta'
import { generatedProperties } from '../src/lib/generatedProperties'
import { absoluteUrl } from '../src/lib/structuredData'

type Head = {
  title: string
  description?: string
  canonical?: string
  ogDescription?: string
  image?: string
  noindex?: boolean
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(h: Head): string {
  const attr = 'data-static-head'
  const tags = [`<title ${attr}>${esc(h.title)}</title>`]
  const meta = (key: 'name' | 'property', k: string, v: string) =>
    tags.push(`<meta ${attr} ${key}="${k}" content="${esc(v)}" />`)
  if (h.noindex) meta('name', 'robots', 'noindex, follow')
  if (h.description) meta('name', 'description', h.description)
  if (h.canonical) tags.push(`<link ${attr} rel="canonical" href="${esc(h.canonical)}" />`)
  meta('property', 'og:title', h.title)
  const ogDesc = h.ogDescription ?? h.description
  if (ogDesc) meta('property', 'og:description', ogDesc)
  if (h.canonical) meta('property', 'og:url', h.canonical)
  meta('property', 'og:site_name', 'Group Casas')
  meta('property', 'og:type', 'website')
  meta('property', 'og:locale', 'es_ES')
  meta('property', 'og:image', h.image ?? absoluteUrl('/og-default.jpg'))
  meta('name', 'twitter:card', 'summary_large_image')
  return tags.map((t) => `    ${t}`).join('\n')
}

export function staticHead(): Plugin {
  let outDir = 'dist'
  return {
    name: 'casas-static-head',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    closeBundle() {
      const shell = readFileSync(join(outDir, 'index.html'), 'utf8')
      if (!shell.includes('</head>')) throw new Error('staticHead: index.html sin </head>')
      const write = (file: string, h: Head) => {
        const path = join(outDir, file)
        mkdirSync(dirname(path), { recursive: true })
        writeFileSync(path, shell.replace('</head>', `${headTags(h)}\n  </head>`))
      }

      // 404 primero: parte del shell original, antes de sobrescribir index.html.
      write('404.html', { title: 'Página no encontrada | Group Casas', noindex: true })

      for (const [path, m] of Object.entries(PAGE_META)) {
        const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
        write(file, { ...m, canonical: absoluteUrl(path as StaticPagePath) })
      }

      for (const p of generatedProperties) {
        write(`propiedades/${p.id}.html`, propertySeo(p))
      }

      console.log(
        `✔ staticHead: ${Object.keys(PAGE_META).length} páginas + ${generatedProperties.length} inmuebles + 404.html`,
      )
    },
  }
}
