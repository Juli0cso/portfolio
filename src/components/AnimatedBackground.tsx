import { useEffect, useRef } from 'react'

const REACTIVE_BACKGROUND_QUERY =
  '(min-width: 768px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)'

export default function AnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return

    const media = window.matchMedia(REACTIVE_BACKGROUND_QUERY)
    let frame = 0
    let listening = false

    const updatePosition = (event: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        background.style.setProperty('--mouse-x', `${event.clientX}px`)
        background.style.setProperty('--mouse-y', `${event.clientY}px`)
      })
    }

    const syncListener = () => {
      if (media.matches && !listening) {
        window.addEventListener('mousemove', updatePosition, { passive: true })
        listening = true
      } else if (!media.matches && listening) {
        window.removeEventListener('mousemove', updatePosition)
        listening = false
        cancelAnimationFrame(frame)
      }
    }

    syncListener()
    media.addEventListener('change', syncListener)

    return () => {
      cancelAnimationFrame(frame)
      if (listening) window.removeEventListener('mousemove', updatePosition)
      media.removeEventListener('change', syncListener)
    }
  }, [])

  return (
    <div ref={backgroundRef} className="animated-background" aria-hidden="true">
      <div className="animated-background__grain" />
      <div className="animated-background__grid" />
      <div className="animated-background__glow" />
      <div className="animated-background__focus-grid" />
    </div>
  )
}
