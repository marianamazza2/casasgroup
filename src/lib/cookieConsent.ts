// Estado del consentimiento de cookies. Cualquier script no esencial (GA, Meta
// Pixel…) debe cargarse solo si getCookieConsent() === 'accepted', y escuchar
// COOKIE_CONSENT_CHANGE_EVENT para reaccionar cuando el usuario decide.

export type CookieConsentValue = 'accepted' | 'rejected'

const STORAGE_KEY = 'gc-cookie-consent'
// La AEPD admite conservar la elección hasta 24 meses; volvemos a preguntar a los 12
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

export const COOKIE_CONSENT_CHANGE_EVENT = 'gc:cookie-consent-change'
export const COOKIE_CONSENT_OPEN_EVENT = 'gc:cookie-consent-open'

export function getCookieConsent(): CookieConsentValue | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { value, date } = JSON.parse(raw) as { value: CookieConsentValue; date: number }
    if (Date.now() - date > MAX_AGE_MS) return null
    return value === 'accepted' || value === 'rejected' ? value : null
  } catch {
    return null
  }
}

export function setCookieConsent(value: CookieConsentValue) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, date: Date.now() }))
  } catch {
    // Almacenamiento bloqueado: el aviso volverá a aparecer en la próxima visita
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: value }))
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT))
}
