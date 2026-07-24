import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const CUSTOM_CURSOR_QUERY =
  '(min-width: 768px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)'

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '.glitch-hover',
  '.tilt-card',
  '.cursor-pointer',
  '.social-icon',
].join(',')

function getCursorTarget(target: EventTarget | null) {
  const element = target instanceof Element ? target : null
  if (!element) return { hovered: false, text: '' }

  const contextualTarget = element.closest<HTMLElement>('[data-cursor-text]')
  if (contextualTarget) {
    return {
      hovered: true,
      text: contextualTarget.dataset.cursorText ?? '',
    }
  }

  return {
    hovered: Boolean(element.closest(INTERACTIVE_SELECTOR)),
    text: '',
  }
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [text, setText] = useState('')
  const hoverState = useRef({ hovered: false, text: '' })
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const x = useSpring(pointerX, { stiffness: 600, damping: 30, mass: 0.4 })
  const y = useSpring(pointerY, { stiffness: 600, damping: 30, mass: 0.4 })
  const glowX = useSpring(pointerX, { stiffness: 210, damping: 26, mass: 0.65 })
  const glowY = useSpring(pointerY, { stiffness: 210, damping: 26, mass: 0.65 })

  useEffect(() => {
    setEnabled(true)
  }, [pointerX, pointerY])

  useEffect(() => {
    if (!enabled) return

    const move = (event: MouseEvent) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)

      const next = getCursorTarget(event.target)
      const previous = hoverState.current
      if (next.hovered !== previous.hovered) setHovered(next.hovered)
      if (next.text !== previous.text) setText(next.text)
      hoverState.current = next
    }

    const leave = () => {
      pointerX.set(-100)
      pointerY.set(-100)
      hoverState.current = { hovered: false, text: '' }
      setHovered(false)
      setText('')
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [enabled, pointerX, pointerY])

  if (!enabled) return null

  const size = text ? 80 : hovered ? 48 : 20

  return (
    <>
      <motion.div
        className="custom-cursor-glow"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        aria-hidden="true"
      />
      <motion.div
        className="custom-cursor"
        style={{
          x,
          y,
          width: size,
          height: size,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: hovered && !text
            ? 'rgba(245, 245, 245, 0.15)'
            : 'rgba(245, 245, 245, 0.9)',
          border: hovered && !text
            ? '1px solid rgba(245, 245, 245, 0.6)'
            : 'none',
        }}
        aria-hidden="true"
      >
        {text && <span>{text}</span>}
      </motion.div>
    </>
  )
}
