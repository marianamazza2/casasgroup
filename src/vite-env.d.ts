/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clave pública de MapTiler para los tiles del mapa. */
  readonly VITE_MAPTILER_KEY: string
  /** Cloud name público de Cloudinary, usado para construir las URLs de imagen. */
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  /** Fuente de datos de inmuebles: 'sheet' (generado) o 'hardcoded' (default). */
  readonly VITE_DATA_SOURCE?: 'sheet' | 'hardcoded'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
