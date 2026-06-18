import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

/**
 * Barra de carga superior estilo NProgress.
 * Solo aparece cuando una navegación tarda más que `SHOW_DELAY` (loaders,
 * chunks lazy, conexiones lentas). En navegaciones instantáneas no se ve,
 * evitando parpadeos.
 */
const SHOW_DELAY = 120 // ms antes de mostrar la barra

export function RouteProgress() {
  const isPending = useRouterState({ select: (s) => s.status === 'pending' })
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }

    if (isPending) {
      // Esperar un poco antes de mostrar: las navegaciones rápidas no parpadean
      timers.current.push(
        setTimeout(() => {
          setVisible(true)
          setProgress(8)
          // Avance progresivo simulado hasta ~90%
          timers.current.push(setTimeout(() => setProgress(45), 80))
          timers.current.push(setTimeout(() => setProgress(75), 280))
          timers.current.push(setTimeout(() => setProgress(90), 700))
        }, SHOW_DELAY),
      )
    } else {
      clearTimers()
      setProgress((p) => (p > 0 ? 100 : 0))
      // Tras completar, ocultar y resetear
      const hide = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 280)
      timers.current.push(hide)
    }

    return clearTimers
  }, [isPending])

  return (
    <div
      className="route-progress"
      data-active={visible || undefined}
      aria-hidden="true"
    >
      <div
        className="route-progress-bar"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  )
}
