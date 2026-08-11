/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clave pública de MapTiler para los tiles del mapa. */
  readonly VITE_MAPTILER_KEY: string
  /** Cloud name público de Cloudinary, usado para construir las URLs de imagen. */
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  /**
   * Dominio canónico del sitio, sin barra final (default 'https://groupcasas.com').
   * Se usa para canonicals, og:url y JSON-LD. Sobrescribible para previews/staging.
   */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
