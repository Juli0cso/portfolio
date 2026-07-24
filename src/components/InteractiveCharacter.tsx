import { useEffect, useRef, useState } from 'react'

type Vector = { x: number; y: number }

export function InteractiveCharacter() {
  const character = useRef<HTMLDivElement>(null)
  const [look, setLook] = useState<Vector>({ x: 0, y: 0 })
  const [tilt, setTilt] = useState<Vector>({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let frame = 0
    const update = (event: MouseEvent) => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = character.current?.getBoundingClientRect()
        if (!box) return
        const centerX = box.left + box.width / 2
        const centerY = box.top + box.height / 2
        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
        const distance = Math.min(9.5, Math.hypot(event.clientX - centerX, event.clientY - centerY) / 28)
        setLook({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance })
        setTilt({
          x: Math.max(-10, Math.min(10, (event.clientX / innerWidth - .5) * 20)),
          y: Math.max(-10, Math.min(10, (event.clientY / innerHeight - .5) * -20)),
        })
      })
    }
    window.addEventListener('mousemove', update, { passive: true })
    return () => { window.removeEventListener('mousemove', update); if (frame) cancelAnimationFrame(frame) }
  }, [])

  return <div className="character-stage">
    <div className="character-glow" />
    <div
      ref={character}
      className="character"
      style={{ '--character-rx': `${tilt.y}deg`, '--character-ry': `${tilt.x}deg`, '--eye-x': `${look.x}px`, '--eye-y': `${look.y}px` } as React.CSSProperties}
      role="img"
      aria-label="Assistente digital interativo acompanhando o movimento do ponteiro"
    >
      <div className="character__body"><i /><i /></div>
      <div className="character__hat-brim" />
      <div className="character__hat" />
      <div className="character__face">
        <div className="character__eye character__eye--left"><i /></div>
        <div className="character__eye character__eye--right"><i /></div>
      </div>
      <div className="character__ear character__ear--left" />
      <div className="character__ear character__ear--right" />
    </div>
  </div>
}
