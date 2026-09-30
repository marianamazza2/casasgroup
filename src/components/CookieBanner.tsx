import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  COOKIE_CONSENT_OPEN_EVENT,
  getCookieConsent,
  setCookieConsent,
  type CookieConsentValue,
} from '../lib/cookieConsent'

// Estado del velo. WebkitBackdropFilter no está en los tipos de framer-motion,
// pero Safari lo necesita, así que se fuerza el tipo.
const veil = (alpha: number, filter: string) =>
  ({
    backgroundColor: `rgba(26, 26, 24, ${alpha})`,
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
  }) as TargetAndTransition

// Aviso de consentimiento: tarjeta centrada sobre un velo difuminado. Solo dos
// opciones con el mismo peso visual y el mismo tamaño (la AEPD exige que
// rechazar sea tan fácil como aceptar). Se puede reabrir desde la política de
// privacidad.
export function CookieBanner() {
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pequeño retraso para no competir con la animación de entrada del hero
    const t = window.setTimeout(() => {
      if (!getCookieConsent()) setOpen(true)
    }, 900)
    const reopen = () => setOpen(true)
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, reopen)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, reopen)
    }
  }, [])

  useEffect(() => {
    if (open) cardRef.current?.focus({ preventScroll: true })
  }, [open])

  const choose = (value: CookieConsentValue) => {
    setCookieConsent(value)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cookie-overlay"
          // Se animan el velo y el desenfoque, no la opacidad del contenedor:
          // Safari descarta el backdrop-filter de un elemento que anima su
          // propia opacidad y el fondo se veria nitido. Ver .cookie-overlay.
          initial={veil(0, 'blur(0px) saturate(1)')}
          animate={veil(0.32, 'blur(4px) saturate(0.98)')}
          exit={veil(0, 'blur(0px) saturate(1)')}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <motion.div
            ref={cardRef}
            tabIndex={-1}
            className="cookie-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-text"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 id="cookie-title" className="cookie-title">
              Cookies
            </h2>
            <p id="cookie-text" className="cookie-text">
              Utilizamos cookies para que tu visita sea más cómoda y para seguir mejorando
              nuestra web. Más información en nuestra{' '}
              <Link to="/politica-de-cookies" onClick={() => setOpen(false)}>
                Política de cookies
              </Link>
              .
            </p>
            <div className="cookie-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--reject"
                onClick={() => choose('rejected')}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--accept"
                onClick={() => choose('accepted')}
              >
                Aceptar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
