import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

const glyphs = '01!@#$%^&*><{}[]ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function DecodeText({ text, className = '' }: { text: string; className?: string }) {
  const [value, setValue] = useState(text)
  const running = useRef(false)

  const decode = () => {
    if (running.current) return
    running.current = true
    let cursor = 0
    const timer = window.setInterval(() => {
      setValue(text.split('').map((char, index) => {
        if (char === ' ') return ' '
        return index < cursor ? char : glyphs[Math.floor(Math.random() * glyphs.length)]
      }).join(''))
      cursor += .55
      if (cursor >= text.length + 1) {
        window.clearInterval(timer)
        setValue(text)
        running.current = false
      }
    }, 35)
  }

  useEffect(() => { const timer = window.setTimeout(decode, 250); return () => window.clearTimeout(timer) }, [text])

  return <span className={`decode-text glitch-hover ${className}`} data-text={text} onMouseEnter={decode}>
    {value.split('').map((char, index) => <span key={index} className={char !== text[index] && char !== ' ' ? 'decode-char' : ''}>{char}</span>)}
  </span>
}

export function Typewriter({ words }: { words: string[] }) {
  const [word, setWord] = useState(0)
  const [value, setValue] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = words[word]
    let delay = deleting ? 40 : 75
    if (!deleting && value === target) delay = 1800
    const timer = window.setTimeout(() => {
      if (!deleting && value === target) setDeleting(true)
      else if (deleting && value === '') { setDeleting(false); setWord((index) => (index + 1) % words.length) }
      else setValue(deleting ? target.slice(0, value.length - 1) : target.slice(0, value.length + 1))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [value, deleting, word, words])

  return <span className="typewriter">{value}<i /></span>
}

export function Tilt({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const { clientX, clientY } = event
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const node = ref.current
      if (!node) return
      const box = node.getBoundingClientRect()
      const x = (clientX - box.left) / box.width - .5
      const y = (clientY - box.top) / box.height - .5
      node.style.setProperty('--tilt-x', `${-y * max}deg`)
      node.style.setProperty('--tilt-y', `${x * max}deg`)
      node.style.setProperty('--shine-x', `${(x + .5) * 100}%`)
      node.style.setProperty('--shine-y', `${(y + .5) * 100}%`)
    })
  }
  const reset = () => {
    cancelAnimationFrame(frame.current)
    ref.current?.style.setProperty('--tilt-x', '0deg')
    ref.current?.style.setProperty('--tilt-y', '0deg')
  }
  return <div ref={ref} className={`tilt-card ${className}`} onMouseMove={move} onMouseLeave={reset}><div className="tilt-shine" />{children}</div>
}

export function InteractionSound() {
  useEffect(() => {
    let context: AudioContext | null = null
    const click = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('a,button,.cursor-pointer') || localStorage.getItem('portfolio-sound') === 'off') return
      context ??= new AudioContext()
      const oscillator = context.createOscillator(), gain = context.createGain(), now = context.currentTime
      oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(800, now); oscillator.frequency.exponentialRampToValueAtTime(600, now + .05)
      gain.gain.setValueAtTime(.001, now); gain.gain.linearRampToValueAtTime(.06, now + .005); gain.gain.exponentialRampToValueAtTime(.001, now + .05)
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start(now); oscillator.stop(now + .06)
    }
    window.addEventListener('click', click)
    return () => { window.removeEventListener('click', click); context?.close() }
  }, [])
  return null
}

export const cssVars = (values: Record<string, string>): CSSProperties => values as CSSProperties
