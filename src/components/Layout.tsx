import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { GithubIcon, LinkedinIcon } from './Icons'

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Track { artist: string; title: string; duration: string; src?: string }

/* ─── Tracks ─────────────────────────────────────────────────────────────── */
const tracks: Track[] = [
  { artist: 'POST MALONE, SWAE LEE', title: 'Sunflower', duration: '2:42' },
  { artist: 'KENDRICK LAMAR', title: 'HUMBLE.', duration: '2:57' },
  { artist: 'TYLER, THE CREATOR', title: 'See You Again', duration: '3:57' },
  { artist: 'FRANK OCEAN', title: 'Nights', duration: '5:07' },
  { artist: 'CHILDISH GAMBINO', title: 'Redbone', duration: '5:26' },
]

/* ─── Background ─────────────────────────────────────────────────────────── */
export function Background() {
  const [rings, setRings] = useState<{ id: number; x: number; y: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  // Particle canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Skip particle canvas entirely on touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    // Check reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let frame = 0
    const PARTICLE_COUNT = 45
    const CONNECTION_DIST = 130
    const MOUSE_REPEL_DIST = 110

    // Init particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      size: Math.random() * 1.8 + .8,
      baseAlpha: Math.random() * .35 + .1,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Detect dark mode
      const isDark = document.documentElement.dataset.theme === 'dark'
      const particleColor = isDark ? '255,255,255' : '0,0,0'
      const lineColor = isDark ? '255,51,51' : '255,51,51'

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST * .6
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Friction
        p.vx *= .988
        p.vy *= .988

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColor},${p.baseAlpha})`
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const q = particles[j]
          const cdx = p.x - q.x
          const cdy = p.y - q.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < CONNECTION_DIST) {
            const alpha = (1 - cdist / CONNECTION_DIST) * .12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`
            ctx.lineWidth = .5
            ctx.stroke()
          }
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])

  // Mouse tracking for both canvas particles and CSS spot
  useEffect(() => {
    const move = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`)
    }
    const click = (event: MouseEvent) => {
      const ring = { id: Date.now(), x: event.clientX, y: event.clientY }
      setRings((current) => [...current, ring])
      window.setTimeout(() => setRings((current) => current.filter(({ id }) => id !== ring.id)), 650)
    }
    window.addEventListener('mousemove', move); window.addEventListener('click', click)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('click', click) }
  }, [])

  return <div className="background">
    <div className="grid-base" /><div className="grid-spot" /><div className="dot-spot" /><div className="noise" /><div className="vignette" />
    <div className="ambient-orb ambient-orb--1" /><div className="ambient-orb ambient-orb--2" />
    <canvas ref={canvasRef} className="particles-canvas" />
    {rings.map((ring) => <i className="click-ring" key={ring.id} style={{ left: ring.x, top: ring.y }} />)}
  </div>
}

/* ─── Boot loader ────────────────────────────────────────────────────────── */
export function BootLoader() {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const messages = ['MOUNTING KERNEL...', 'LOADING ASSETS...', 'INJECTING MODULES...', 'COMPILING ROUTES...', 'VERIFYING INTEGRITY...', 'SYSTEM READY']
  useEffect(() => {
    const timer = window.setInterval(() => setProgress((value) => {
      if (value >= 100) { window.clearInterval(timer); window.setTimeout(() => setHidden(true), 420); return 100 }
      return Math.min(100, value + 10 + Math.round(Math.random() * 14))
    }), 60)
    return () => window.clearInterval(timer)
  }, [])
  if (hidden) return null
  const message = messages[Math.min(Math.floor(progress / 100 * messages.length), messages.length - 1)]
  return <div className={`loader ${progress === 100 ? 'loader--done' : ''}`}>
    <span className="corner corner--tl" /><span className="corner corner--tr" /><span className="corner corner--br" /><span className="corner corner--bl" />
    <div className="loader__content"><p>// PORTFOLIO.INIT</p><h1>JÚLIO CÉSAR</h1><strong>JAVA DEVELOPER</strong>
      <div className="loader__meta"><span>{message}</span><span>{progress}%</span></div><div className="loader__bar"><i style={{ width: `${progress}%` }} /></div>
      <div className="loader__blocks">{Array.from({ length: 20 }, (_, index) => <i key={index} className={index < Math.floor(progress / 5) ? 'active' : ''} />)}</div>
    </div><small className="loader__version">SYS.VER 2.0 · JULIO.CESAR · BUILD 2026</small>
  </div>
}

/* ─── Theme picker ───────────────────────────────────────────────────────── */
function ThemePicker() {
  const [theme, setTheme] = useState('light')
  const choose = (next: string) => {
    setTheme(next); localStorage.setItem('portfolio-theme', next)
    const dark = next === 'dark' || (next === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }
  useEffect(() => { choose(localStorage.getItem('portfolio-theme') || 'light') }, [])
  const icon = theme === 'dark' ? '☾' : theme === 'light' ? '☼' : '▣'
  const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
  return <button className="sound-btn" title={`Tema: ${theme}`} aria-label="Alterar tema" onClick={() => choose(next)}>{icon}</button>
}

/* ─── YASH_OS Terminal ───────────────────────────────────────────────────── */
function YashTerminal({ open, close }: { open: boolean; close: () => void }) {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<{ type: string; text: string }[]>([
    { type: 'sys', text: 'YASH_OS Terminal [Version 1.0.0]' },
    { type: 'sys', text: '(c) Yashwanth Patam. All rights reserved.' },
    { type: 'sys', text: 'Type "help" for a list of available commands.' },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 80) } }, [open])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const commands: Record<string, () => { type: string; text: string }[]> = {
    help: () => [
      { type: 'output', text: 'Available commands:' },
      { type: 'output', text: '  whoami    — Show user info' },
      { type: 'output', text: '  skills    — List technical skills' },
      { type: 'output', text: '  projects  — Show featured projects' },
      { type: 'output', text: '  contact   — Get contact info' },
      { type: 'output', text: '  zoro      — ???' },
      { type: 'output', text: '  clear     — Clear terminal' },
    ],
    whoami: () => [
      { type: 'output', text: 'juliocso / Júlio César Sousa Oliveira' },
      { type: 'output', text: 'Role: Backend Developer' },
      { type: 'output', text: 'Location: Brasília, DF' },
      { type: 'output', text: 'Status: Available for hire' },
    ],
    skills: () => [
      { type: 'output', text: 'Core: Java · Spring Boot · APIs REST' },
      { type: 'output', text: 'DB  : MySQL · MongoDB · Redis' },
      { type: 'output', text: 'DevOps: Docker · GitHub · Linux' },
      { type: 'output', text: 'Extras: n8n · Firebase · React' },
    ],
    projects: () => [
      { type: 'output', text: '[01] API RESTful com Spring Boot' },
      { type: 'output', text: '[02] Automação Corporativa com n8n' },
      { type: 'output', text: '[03] Robótica e IoT com ESP32' },
    ],
    contact: () => [
      { type: 'output', text: 'EMAIL  : jc.nizuu@gmail.com' },
      { type: 'output', text: 'GITHUB : github.com/Juliocso' },
      { type: 'output', text: 'LINKEDIN: linkedin.com/in/juliocso' },
    ],
    zoro: () => [
      { type: 'ascii', text: '' },
      { type: 'zoro', text: 'RORONOA ZORO:' },
      { type: 'zoro-quote', text: '"When I decided to follow my dream, I had already discarded my life."' },
      { type: 'sys', text: '[sys] initiating system link to Zoro assistant...' },
    ],
    clear: () => [],
  }

  const run = () => {
    const cmd = input.trim().toLowerCase()
    if (!cmd) return
    const newLine = { type: 'cmd', text: `> ${cmd}` }
    if (cmd === 'clear') { setLines([newLine, ...commands.clear()]); setInput(''); return }
    const result = commands[cmd] ? commands[cmd]() : [{ type: 'error', text: `command not found: ${cmd}. Type "help" for a list.` }]
    setLines(prev => [...prev, newLine, ...result])
    setInput('')
  }

  if (!open) return null
  return <div className="yash-terminal" onClick={(e) => { if (e.target === e.currentTarget) close() }}>
    <div className="yash-terminal__window">
      <div className="yash-terminal__bar">
        <span>YASH_OS / TERMINAL</span>
        <div className="yash-terminal__controls">
          <button aria-label="minimize">−</button>
          <button aria-label="maximize">□</button>
          <button aria-label="close" onClick={close}>×</button>
        </div>
      </div>
      <div className="yash-terminal__body" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, i) => (
          <div key={i} className={`yash-term-line yash-term-line--${line.type}`}>
            {line.type === 'ascii' ? <span className="yash-zoro-skull">☠</span> : line.text}
          </div>
        ))}
        <div ref={endRef} />
        <div className="yash-term-input-row">
          <span>&gt;</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') run() }} placeholder="" autoComplete="off" spellCheck={false} />
        </div>
      </div>
    </div>
  </div>
}

/* ─── Command palette (CTRL+K navigation) ───────────────────────────────── */
function CommandPalette({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState('')
  const links = [['SKILLS', '#skills'], ['PROJETOS', '#projects'], ['GITHUB ACTIVITY', '#activity'], ['SOBRE MIM', '#about'], ['EXPERIÊNCIA', '#experience'], ['FORMAÇÃO', '#education'], ['CERTIFICADOS', '#certificates'], ['CONTATO', '#contact']]
  if (!open) return null
  const filtered = links.filter(([name]) => name.includes(query.toUpperCase()))
  return <div className="terminal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><div className="terminal-panel">
    <div className="terminal-panel__head"><span>JC::COMMAND_CENTER</span><button onClick={close}>ESC</button></div>
    <label><span>›</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="DIGITE UM COMANDO..." /></label>
    <div className="terminal-results">{filtered.map(([name, href], index) => <a href={href} onClick={close} key={href}><i>{String(index + 1).padStart(2, '0')}</i><span>{name}</span><b>↵</b></a>)}</div>
    <small>↑↓ NAVIGATE · ENTER SELECT · ESC CLOSE</small>
  </div></div>
}

/* ─── Mini player YASHAMP v1.0 ───────────────────────────────────────────── */
function MiniPlayer({ open, close }: { open: boolean; close: () => void }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const track = tracks[trackIndex]

  const prevTrack = () => { setTrackIndex(i => (i - 1 + tracks.length) % tracks.length); setProgress(0) }
  const nextTrack = () => { setTrackIndex(i => (i + 1) % tracks.length); setProgress(0) }
  const togglePlay = () => setPlaying(p => !p)

  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 0.3), 100)
    } else {
      if (progressRef.current) clearInterval(progressRef.current)
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [playing, trackIndex])

  if (!open) return null

  // Parse duration to seconds for display
  const [minStr, secStr] = track.duration.split(':')
  const totalSec = parseInt(minStr) * 60 + parseInt(secStr)
  const elapsed = Math.round((progress / 100) * totalSec)
  const elMin = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const elSec = String(elapsed % 60).padStart(2, '0')

  return <div className="mini-player">
    <div className="mini-player__head"><span>♫ YASHAMP V1.0</span><button onClick={close}>×</button></div>
    <div className="mini-player__display">
      <small>{track.artist}</small>
      <strong>{track.title}</strong>
      <div className="mini-player__bars">{Array.from({ length: 12 }, (_, i) => <i className={playing ? 'playing' : ''} style={{ animationDelay: `${i * 70}ms` }} key={i} />)}</div>
    </div>
    <div className="mini-player__progress-row">
      <span>{elMin}:{elSec}</span>
      <div className="mini-player__progress-bar"><div style={{ width: `${progress}%` }} /></div>
      <span>{track.duration}</span>
    </div>
    <div className="mini-player__controls">
      <button onClick={prevTrack} aria-label="Previous">⏮</button>
      <button className="mini-player__play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? 'Ⅱ' : '▶'}</button>
      <button onClick={nextTrack} aria-label="Next">⏭</button>
    </div>
  </div>
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
export function Header() {
  const [cmdPalette, setCmdPalette] = useState(false)
  const [yashTerminal, setYashTerminal] = useState(false)
  /* framer já corre o listener de scroll numa única fila interna, batida por
     rAF — dispensa o addEventListener('scroll', ...) manual que rodava fora
     de sincronia com o resto das animações da página. */
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 50)
  const [player, setPlayer] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled((prev) => { const next = value > 50; return prev === next ? prev : next })
  })

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCmdPalette(true) }
      if (event.key === 'Escape') { setCmdPalette(false); setYashTerminal(false) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  return <><header className={`header ${scrolled ? 'header--scrolled' : ''}`}><div className="header__inner">
    <a className="brand" href="#home"><b>JC</b><span>DEVELOPER PORTFOLIO</span></a>
    <div className="header__tools">
      <button className="sound-btn" onClick={() => setPlayer(!player)} title="Music Player">♫</button>
      <button className="terminal-trigger" onClick={() => setCmdPalette(true)}><span>⌕</span><i>TERMINAL...</i><kbd>CTRL K</kbd></button>
      <a className="header__resume magnetic glitch-click" href="/curriculo-julio-cesar.pdf" target="_blank">RESUME</a>
      <ThemePicker />
      <button className="menu yash-os-btn" aria-label="Abrir YASH_OS" onClick={() => setYashTerminal(true)} title="YASH_OS Terminal">⊟</button>
    </div>
  </div></header>
    <CommandPalette open={cmdPalette} close={() => setCmdPalette(false)} />
    <YashTerminal open={yashTerminal} close={() => setYashTerminal(false)} />
    <MiniPlayer open={player} close={() => setPlayer(false)} />
  </>
}

/* ─── Assistant rail (ASK ZORO) ─────────────────────────────────────────── */
const zoroReplies: Record<string, string> = {
  projects: '"Nothing happened." — But actually: API REST, n8n automation, IoT with ESP32. Check the projects section ↑',
  stack: 'Java · Spring Boot · MySQL · MongoDB · Redis · React · Docker · n8n · Linux. The basics of power.',
  work: '"I don\'t know what he\'s after... but he burns with ambition." — Yes, open to work. Check status above.',
  zoro: '"When I decided to follow my dream, I had already discarded my life." — I am ZORO, the AI guardian of this portfolio.',
}
const zoroQuickReplies = [
  { label: 'Tell me about your projects.', key: 'projects' },
  { label: 'What\'s your tech stack?', key: 'stack' },
  { label: 'Are you open to work?', key: 'work' },
  { label: 'Who are you, Zoro?', key: 'zoro' },
]

export function AssistantRail() {
  const [open, setOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'ai', text: 'INITIATING SYSTEM... Hello! I am ZORO, your AI Assistant. How can I help you today?' }])
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const update = () => setAtTop(window.scrollY < window.innerHeight * .72)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const send = (text?: string) => {
    const value = (text ?? input).trim(); if (!value) return
    const normalized = value.toLowerCase()
    const answer = Object.keys(zoroReplies).find(k => normalized.includes(k))
      ? zoroReplies[Object.keys(zoroReplies).find(k => normalized.includes(k))!]
      : 'ZORO_SYS> Command not recognized. Try asking about projects, stack, or work availability.'
    setMessages(curr => [...curr, { from: 'user', text: value }, { from: 'ai', text: answer }])
    setInput('')
  }

  return <aside className={`assistant-rail ${open ? 'assistant-rail--open' : ''}`}>
    {atTop && <button className="assistant-teaser" onClick={() => setOpen(true)}>INTERACT WITH ZORO <b>→</b></button>}
    <button className="assistant-tab" onClick={() => setOpen(!open)}><span>⚔</span>ASK ZORO</button>
    {open && <div className="assistant-panel">
      <header>
        <div><b>ZORO_SYS</b><small>STATUS::ONLINE</small></div>
        <button onClick={() => setOpen(false)}>×</button>
      </header>
      <div className="assistant-messages" ref={messagesRef}>{messages.map((msg, i) => <p className={msg.from} key={i}>{msg.from === 'ai' && <span className="zoro-prefix">ZORO_SYS&gt; </span>}{msg.text}</p>)}</div>
      <div className="zoro-quick-replies">{zoroQuickReplies.map(qr => <button key={qr.key} onClick={() => send(qr.label)}>{qr.label}</button>)}</div>
      <label><span>›</span><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="EXECUTE COMMAND..." /><button onClick={() => send()}>SEND</button></label>
    </div>}
  </aside>
}

/* ─── Scroll rail ────────────────────────────────────────────────────────── */
export function ScrollRail() {
  /* Barra ligada direto ao motion value: a escrita no DOM sai da rAF interna
     do framer, sem passar pelo ciclo de render do React a cada tick de
     scroll. Só o número percentual — que precisa virar texto — usa state, e
     mesmo assim só re-renderiza quando o inteiro arredondado muda. */
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: .4 })
  const heightPercent = useTransform(smoothProgress, (value) => `${Math.min(100, Math.max(0, value * 100))}%`)
  const [percent, setPercent] = useState(0)
  useMotionValueEvent(smoothProgress, 'change', (value) => {
    const next = Math.round(Math.min(1, Math.max(0, value)) * 100)
    setPercent((prev) => prev === next ? prev : next)
  })
  return <div className="scroll-rail"><span>SYS.SCROLL</span><div><motion.i style={{ height: heightPercent }} /></div><b>{String(percent).padStart(2, '0')}%</b></div>
}

/* ─── Vocabulário de entrada ─────────────────────────────────────────────────
   Uma curva e uma régua de disparo para o site inteiro, para as seções não
   entrarem cada uma com um tempo diferente.

   REVEAL_SPRING troca a antiga curva de duração fixa (tween) por uma mola
   levemente superamortecida: sem balanço no assentamento — a mesma leitura
   "seca" de antes — mas ao contrário de um tween, uma mola herda a
   velocidade de onde estava se for interrompida. Rolar pra cima e pra baixo
   rápido reiniciava o tween do zero e dava um salto visível; a mola apenas
   muda de direção suavemente, o que é a maior parte do que "não fluido"
   queria dizer aqui.

   REVEAL_ROOT encurta a área de detecção só embaixo: a entrada dispara quando o
   elemento sobe 18% na tela, e a saída só ocorre depois que ele passou inteiro
   pelo topo. Como a saída acontece fora da vista, dá para rearmar a animação
   sem que o rearme apareça — é o que faz o efeito repetir ao subir e descer. */
export const REVEAL_SPRING = { type: 'spring', stiffness: 170, damping: 26, mass: .9 } as const
export const REVEAL_ROOT = '0px 0px -18% 0px'

/* ─── Section heading ────────────────────────────────────────────────────── */
export function SectionHeading({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: REVEAL_ROOT })
  return (
    <motion.div
      ref={ref}
      className="section-heading"
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={inView ? REVEAL_SPRING : { duration: 0 }}
    >
      <p><i /><em>// {index}</em> — {eyebrow}</p>
      <h2 className="glitch-hover" data-text={title}>{title}</h2>
      {/* A régua vermelha risca da esquerda logo depois do título assentar:
          gesto mecânico, no lugar de um fade genérico. */}
      <motion.b
        style={{ transformOrigin: 'left center' }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={inView ? { ...REVEAL_SPRING, delay: .18 } : { duration: 0 }}
      />
      {description && <span>{description}</span>}
    </motion.div>
  )
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
export function Divider() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: REVEAL_ROOT })
  return (
    <motion.div
      ref={ref}
      className="divider shell"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
      transition={inView ? REVEAL_SPRING : { duration: 0 }}
    >
      <i /><b /><i /><span />
    </motion.div>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
export function Footer() {
  return <footer className="footer"><div className="shell footer__top"><div className="brand"><b>JC</b><span>DEVELOPER PORTFOLIO</span></div>
    <nav><a href="#home">HOME</a><a href="#projects">PROJETOS</a><a href="#skills">SKILLS</a><a href="#certificates">CERTIFICADOS</a><a href="#contact">CONTATO</a></nav>
    <div className="footer__social"><a href="https://github.com/Juli0cso" target="_blank" aria-label="GitHub"><GithubIcon /></a><a href="https://www.linkedin.com/in/juli0cso/" target="_blank" aria-label="LinkedIn"><LinkedinIcon /></a></div>
  </div><div className="shell footer__bottom">© {new Date().getFullYear()} JÚLIO CÉSAR SOUSA OLIVEIRA. TODOS OS DIREITOS RESERVADOS.</div></footer>
}
