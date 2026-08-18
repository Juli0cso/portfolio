import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
import { certificates, experiences, projects, skills, type Skill } from '../data/portfolio'
import type { CodeSnippet } from '../data/clubeSnippets'
import { ArrowIcon, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from './Icons'
import { SectionHeading } from './Layout'
import { DecodeText, Tilt, Typewriter } from './Effects'
import { InteractiveCharacter } from './InteractiveCharacter'

/* ─── Scroll reveal wrapper ──────────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0, direction = 'up', scale = false }: {
  children: ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'; scale?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const sign = direction === 'down' || direction === 'right' ? -1 : 1
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        [axis]: 40 * sign,
        filter: 'blur(6px)',
        ...(scale ? { scale: .95 } : {}),
      }}
      animate={inView ? {
        opacity: 1,
        [axis]: 0,
        filter: 'blur(0px)',
        ...(scale ? { scale: 1 } : {}),
      } : {}}
      transition={{ duration: .6, delay, ease: [.25, .1, .25, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export function Hero() {
  const section = useRef<HTMLElement>(null)
  const [visitors, setVisitors] = useState(() => {
    const base = parseInt(localStorage.getItem('portfolio-visitors') || '1248', 10)
    const incremented = base + 1
    localStorage.setItem('portfolio-visitors', String(incremented))
    return incremented
  })

  // Bump visitor every 30s to simulate live count
  useEffect(() => {
    const timer = window.setInterval(() => setVisitors(v => v + 1), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const scroll = () => {
      const node = section.current
      if (!node || window.innerWidth < 768) return
      const progress = Math.max(0, Math.min(1, -node.getBoundingClientRect().top / node.offsetHeight))
      node.style.setProperty('--content-y', `${progress * -220}px`); node.style.setProperty('--visual-y', `${progress * -100}px`); node.style.setProperty('--decor-y', `${progress * 180}px`)
      node.style.setProperty('--hero-scale', `${1 - progress * .08}`); node.style.setProperty('--hero-opacity', `${Math.max(0, 1 - progress * 1.34)}`)
    }
    scroll(); window.addEventListener('scroll', scroll, { passive: true }); return () => window.removeEventListener('scroll', scroll)
  }, [])

  return <section id="home" className="hero shell" ref={section}>
    <div className="hero__decor"><i /><i /></div>
    <div className="hero__content">
      <p className="eyebrow hero-enter">// SYSTEM.INIT</p>
      <h1 className="hero-enter"><DecodeText text="JÚLIO CÉSAR" /><span className="hero__surname">SOUSA OLIVEIRA</span></h1>
      <h2 className="hero-enter"><Typewriter words={['BACKEND JAVA', 'SPRING BOOT DEV', 'API ARCHITECT', 'DEVOPS & AUTOMATION']} /></h2>
      <p className="hero__summary hero-enter">Estudante do 8º semestre de Engenharia da Computação, com foco em desenvolvimento Backend, Java, Spring Boot, APIs, automação e bancos de dados.</p>
      <p className="code-comment hero-enter">/* Construindo integrações corporativas, explorando IA generativa e transformando problemas em software. */</p>
      <div className="status-row hero-enter">
        <span><i><b /></i> STATUS: OPEN_TO_WORK</span>
        <span className="visitors-badge"><i>👁</i> VISITORS: {visitors.toLocaleString()}</span>
      </div>
      <div className="social-row hero-enter">
        <a href="https://github.com/Juli0cso" target="_blank"><GithubIcon /> GITHUB</a>
        <a href="https://www.linkedin.com/in/juli0cso/" target="_blank"><LinkedinIcon /> LINKEDIN</a>
        <a href="mailto:jc.nizuu@gmail.com"><MailIcon /> E-MAIL</a>
      </div>
      <div className="hero__actions hero-enter"><a className="btn btn--dark glitch-click" href="#projects">EXPLORE_PROJECTS</a><a className="btn btn--red glitch-click" href="/curriculo-julio-cesar.pdf" target="_blank">VIEW_RESUME</a></div>
      <div className="hero__location hero-enter"><span>SYS.LOC: BRASÍLIA, DF</span><span>LAT: 15.8128° S</span><span>LNG: 47.9294° W</span></div>
    </div>
    <div className="hero__visual"><InteractiveCharacter /><div className="hero__index">JC&nbsp; /&nbsp; 08</div></div>
    <a href="#skills" className="scroll-mark">SCROLL <i /></a>
  </section>
}

/* ─── About ──────────────────────────────────────────────────────────────── */
export function About() {
  return <section id="about" className="section shell"><SectionHeading index="04" eyebrow="PROFILE" title="SOBRE MIM" />
    <Reveal className="about-grid" delay={.1}>
      <div className="about-terminal"><div className="terminal-bar"><span>PROFILE.README</span><span>● ● ●</span></div><p><em>01</em> Estudante do 8º semestre de Engenharia da Computação, com foco prático em Desenvolvimento Backend, Java e ecossistema Spring Boot. Atualmente estagiando na Defensoria Pública do Distrito Federal (DPDF).</p><p><em>02</em> Tenho experiência com automação de processos, criação e consumo de APIs, web scraping e banco de dados. Gosto de resolver problemas usando código, construindo integrações para sistemas corporativos, usando IA generativa ou trabalhando com robótica e microcontroladores.</p><p><em>03</em> Busco oportunidades para crescer como desenvolvedor backend e aplicar meus conhecimentos em arquitetura de software.</p></div>
      <div className="about-stats"><article><strong>08</strong><span>SEMESTRE ATUAL</span></article><article><strong>03</strong><span>EXPERIÊNCIAS</span></article><article><strong>2027</strong><span>CONCLUSÃO PREVISTA</span></article><article><strong>JAVA</strong><span>FOCO PRINCIPAL</span></article></div>
    </Reveal>
  </section>
}

/* ─── Skills ─────────────────────────────────────────────────────────────── */
export function Skills() {
  const tabs = [{ key: 'all', label: 'ALL' }, { key: 'backend', label: 'BACKEND & DB' }, { key: 'frontend', label: 'FRONTEND & DESIGN' }, { key: 'tools', label: 'CLOUD & DEV TOOLS' }]
  const [tab, setTab] = useState('all')
  const filtered = useMemo(() => tab === 'all' ? skills : skills.filter((skill) => tab === 'tools' ? ['tools', 'other'].includes(skill.category) : skill.category === tab), [tab])
  return <section id="skills" className="section shell skills"><SectionHeading index="01" eyebrow="CAPABILITIES" title="SKILLS" />
    <Reveal className="skill-tabs" delay={.1}>{tabs.map(({ key, label }) => <button className={tab === key ? 'active' : ''} onClick={() => setTab(key)} key={key}>{label}</button>)}</Reveal>
    <div className="skill-grid">{filtered.map((skill, index) => <SkillCard skill={skill} index={index} key={skill.name} />)}</div>
  </section>
}

/* ─── Skill card internals ───────────────────────────────────────────────── */
const skillLabels: Record<string, [string, string, number]> = {
  Java: ['LANGUAGE', 'FOCO PRINCIPAL', 4], 'Spring Boot': ['FRAMEWORK', 'INTERMEDIÁRIO', 3], Python: ['LANGUAGE', 'INTERMEDIÁRIO', 3], 'C / C++': ['LANGUAGE', 'FAMILIAR', 2], POO: ['PARADIGM', 'INTERMEDIÁRIO', 3], 'APIs REST': ['ARCHITECTURE', 'INTERMEDIÁRIO', 3], 'Web Scraping': ['AUTOMATION', 'INTERMEDIÁRIO', 3], SQL: ['DATABASE', 'INTERMEDIÁRIO', 3], MongoDB: ['DATABASE', 'FAMILIAR', 2], Redis: ['CACHING', 'FAMILIAR', 2], JavaScript: ['LANGUAGE', 'INTERMEDIÁRIO', 3], HTML: ['MARKUP', 'INTERMEDIÁRIO', 3], CSS: ['STYLING', 'INTERMEDIÁRIO', 3], React: ['LIBRARY', 'FAMILIAR', 2], Figma: ['DESIGN', 'FAMILIAR', 2], Git: ['VCS', 'INTERMEDIÁRIO', 3], GitHub: ['PLATFORM', 'INTERMEDIÁRIO', 3], Docker: ['DEV TOOLS', 'FAMILIAR', 2], 'Linux / CLI': ['OPERATING SYSTEM', 'INTERMEDIÁRIO', 3], Bash: ['SHELL', 'FAMILIAR', 2], n8n: ['AUTOMATION', 'INTERMEDIÁRIO', 3], Redes: ['INFRASTRUCTURE', 'INTERMEDIÁRIO', 3], Cibersegurança: ['CYBERSEC', 'FAMILIAR', 2], Security: ['CYBERSEC', 'FAMILIAR', 2], Vercel: ['DEPLOYMENT', 'FAMILIAR', 2], Firebase: ['CLOUD', 'FAMILIAR', 2], 'Google Cloud': ['CLOUD', 'FAMILIAR', 2], Azure: ['CLOUD', 'FAMILIAR', 2], 'IA Generativa': ['ARTIFICIAL INTELLIGENCE', 'USO PRÁTICO', 3], Arduino: ['HARDWARE', 'INTERMEDIÁRIO', 3], 'ESP32 / CAM': ['MICROCONTROLLER', 'INTERMEDIÁRIO', 3], Eletrônica: ['HARDWARE', 'INTERMEDIÁRIO', 3], 'Sensor ultrassônico': ['SENSOR', 'FAMILIAR', 2], 'Manutenção de PCs': ['HARDWARE', 'AVANÇADO', 4], 'Power BI': ['DATA TOOL', 'FAMILIAR', 2], 'Inglês · Intermediário': ['LANGUAGE', 'INTERMEDIÁRIO', 3], 'Espanhol · Avançado': ['LANGUAGE', 'AVANÇADO', 4],
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [label, setLabel] = useState(skill.name)
  const wrapper = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const [category, status, level] = skillLabels[skill.name] ?? ['TECHNOLOGY', 'FAMILIAR', 2]
  const enter = () => {
    setHovered(true); let cursor = 0
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setLabel(skill.name.split('').map((char, position) => position < cursor || char === ' ' ? char : 'X01!@#$%^&*><{}[]'[Math.floor(Math.random() * 17)]).join(''))
      cursor += .5
      if (cursor >= skill.name.length) { if (timer.current) window.clearInterval(timer.current); setLabel(skill.name) }
    }, 25)
  }
  const leave = () => {
    setHovered(false); setLabel(skill.name)
    if (timer.current) window.clearInterval(timer.current)
    if (wrapper.current) wrapper.current.style.transform = 'translate3d(0,0,0)'
  }
  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapper.current || window.matchMedia('(pointer:coarse)').matches) return
    const box = wrapper.current.getBoundingClientRect(), x = (event.clientX - box.left - box.width / 2) * .18, y = (event.clientY - box.top - box.height / 2) * .18
    wrapper.current.style.transform = `translate3d(${x}px,${y}px,0)`
  }
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current) }, [])
  return <div ref={wrapper} className="skill-magnetic" style={{ '--delay': `${Math.min(index, 14) * 32}ms`, '--tone': skill.tone } as React.CSSProperties} onMouseMove={move} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
    <article className={`skill-card ${hovered ? 'is-hovered' : ''}`} tabIndex={0}><span>{skill.icon.startsWith('devicon-') ? <i className={skill.icon} /> : skill.icon}</span><b>{label.split('').map((char, position) => <i className={char !== skill.name[position] ? 'scrambled' : ''} key={position}>{char}</i>)}</b></article>
    {hovered && <div className="skill-tooltip"><div><small><span>{category}</span><b>{status}</b></small><strong>{skill.name}</strong><div className="level"><em>LVL</em><span>{Array.from({ length: 5 }, (_, position) => <i className={position < level ? 'active' : ''} style={{ animationDelay: `${position * 100}ms` }} key={position} />)}</span></div></div><i className="skill-tooltip__arrow" /></div>}
  </div>
}

/* ─── Projects ───────────────────────────────────────────────────────────── */
/* A prévia embute sempre o viewport de desktop, inclusive no celular: como
   miniatura, o que interessa é a forma da página inteira, e o layout mobile
   dentro de uma caixa pequena mostra só o topo, cortado. Quem abrir em tela
   cheia recebe o layout mobile, porque lá o iframe usa a largura real do
   aparelho e o site decide sozinho. */
const EMBED_DESKTOP = { width: 1440, height: 800 }

/* O único impedimento real é mixed content: um iframe http:// dentro de uma
   página https:// é bloqueado pelo navegador, sem contorno do lado do cliente.
   Aí caímos no mockup estático. */
function useCanEmbed(url?: string) {
  const [canEmbed, setCanEmbed] = useState(false)
  useEffect(() => {
    setCanEmbed(!!url && !(window.location.protocol === 'https:' && url.startsWith('http://')))
  }, [url])
  return canEmbed
}

/* A prévia embutida é deliberadamente NÃO interativa: um iframe cross-origin
   engole os eventos de mouse da página-mãe, o que congela o cursor customizado e
   faz a seção perder o mouseleave (despausando o carrossel por baixo do usuário).
   O site continua ao vivo aqui; quem quiser usar abre em tela cheia. */
function LivePreview({ src, title, onOpen }: { src: string; title: string; onOpen: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ scale: 0 })
  useEffect(() => {
    const node = box.current
    if (!node) return
    /* Escala de cobertura, como `object-fit: cover`: a maior entre as duas razões
       preenche a caixa e recorta a sobra. Derivar a altura da caixa manteria o
       enquadramento certo no desktop, mas no celular mostraria 1440x1335 da
       página a 21% — legível em lugar nenhum. Assim o recorte é sempre o mesmo
       canto superior esquerdo de um viewport de 1440x800. */
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scale = Math.max(width / EMBED_DESKTOP.width, height / EMBED_DESKTOP.height)
      setSize({ scale })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div className="project__embed" ref={box}>
    {size.scale > 0 && <iframe
      src={src} title={title} loading="lazy" referrerPolicy="no-referrer" tabIndex={-1} aria-hidden="true"
      sandbox="allow-scripts allow-same-origin allow-forms"
      /* `zoom` e não `transform: scale()`: o transform encolhe só o desenho e deixa a
         caixa de layout em 1440px, que transborda o card e — onde o recorte do
         overflow não vale para hit-test — rouba o clique dos botões ao lado. */
      style={{ width: EMBED_DESKTOP.width, height: EMBED_DESKTOP.height, zoom: size.scale }}
    />}
    <button className="project__embed-open" onClick={onOpen} data-cursor-text="ABRIR" aria-label={`Abrir ${title} em tela cheia`}>
      <span>ABRIR EM TELA CHEIA <b>⤢</b></span>
    </button>
  </div>
}

/* Realce de sintaxe mínimo, sem dependência: quebra a linha em comentário /
   string / anotação / palavra-chave / número e deixa o resto como texto. A ordem
   importa — comentários e strings primeiro, senão uma palavra-chave dentro de
   uma string seria pintada. */
const CODE_RULES: { cls: string; re: RegExp }[] = [
  { cls: 'tk-comment', re: /(\/\/[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/)/ },
  { cls: 'tk-string', re: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/ },
  { cls: 'tk-annot', re: /(@[A-Za-z_][A-Za-z0-9_]*)/ },
  { cls: 'tk-key', re: /\b(public|private|protected|class|void|return|if|else|for|while|new|throw|final|static|synchronized|instanceof|continue|import|package|try|catch|null|true|false|int|long|double|String|const|let|var|function|of|in|typeof|await|async|CREATE|TABLE|ALTER|INSERT|INTO|VALUES|SELECT|UPDATE|DELETE|TRIGGER|FUNCTION|RETURNS|BEGIN|END|IF|THEN|OR|AND|NOT|EXISTS|POLICY|ENABLE|ROW|LEVEL|SECURITY|LANGUAGE|AFTER|BEFORE|EXECUTE|ON|USING|REFERENCES|PRIMARY|KEY|DEFAULT|CASCADE)\b/ },
  { cls: 'tk-num', re: /\b(\d+(?:\.\d+)?L?)\b/ },
]
const CODE_SPLITTER = new RegExp(CODE_RULES.map((rule) => rule.re.source).join('|'), 'g')

function highlight(line: string) {
  const parts: ReactNode[] = []
  let cursor = 0
  for (const match of line.matchAll(CODE_SPLITTER)) {
    const index = match.slice(1).findIndex((group) => group !== undefined)
    if (index < 0) continue
    if (match.index > cursor) parts.push(line.slice(cursor, match.index))
    parts.push(<span className={CODE_RULES[index].cls} key={match.index}>{match[0]}</span>)
    cursor = match.index + match[0].length
  }
  if (cursor < line.length) parts.push(line.slice(cursor))
  return parts
}

/* Markdown inline: negrito, código e link. O resto do texto passa direto. */
const INLINE_MD = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

function inlineMarkdown(text: string) {
  return text.split(INLINE_MD).filter(Boolean).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) return <a href={link[2]} target="_blank" rel="noreferrer noopener" key={index}>{link[1]}</a>
    return part
  })
}

const isTableRow = (line: string) => line.trim().startsWith('|')
const splitRow = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
/* A linha separadora do cabeçalho (|---|---|) não vira conteúdo. */
const isTableDivider = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim())

function renderMarkdown(source: string) {
  const lines = source.split('\n')
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.startsWith('```')) {                       // bloco de código
      const body: string[] = []
      index++
      while (index < lines.length && !lines[index].startsWith('```')) body.push(lines[index++])
      index++
      blocks.push(<pre className="md-pre" key={blocks.length}><code>{body.join('\n')}</code></pre>)
      continue
    }

    if (isTableRow(line)) {                             // tabela
      const rows: string[][] = []
      while (index < lines.length && isTableRow(lines[index])) {
        if (!isTableDivider(lines[index])) rows.push(splitRow(lines[index]))
        index++
      }
      const [head, ...body] = rows
      blocks.push(<div className="md-table-wrap" key={blocks.length}><table className="md-table">
        <thead><tr>{head.map((cell, i) => <th key={i}>{inlineMarkdown(cell)}</th>)}</tr></thead>
        <tbody>{body.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inlineMarkdown(cell)}</td>)}</tr>)}</tbody>
      </table></div>)
      continue
    }

    if (line.trim().startsWith('- ')) {                 // lista
      const items: string[] = []
      while (index < lines.length && lines[index].trim().startsWith('- ')) items.push(lines[index++].trim().slice(2))
      blocks.push(<ul className="md-list" key={blocks.length}>{items.map((item, i) => <li key={i}>{inlineMarkdown(item)}</li>)}</ul>)
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      const Tag = `h${heading[1].length}` as 'h1' | 'h2' | 'h3'
      blocks.push(<Tag className={`md-h${heading[1].length}`} key={blocks.length}>{inlineMarkdown(heading[2])}</Tag>)
      index++
      continue
    }

    if (/^---+$/.test(line.trim())) { blocks.push(<hr className="md-hr" key={blocks.length} />); index++; continue }

    if (line.trim() === '') { index++; continue }

    const paragraph: string[] = []                      // parágrafo
    while (index < lines.length && lines[index].trim() !== '' && !lines[index].startsWith('```')
           && !isTableRow(lines[index]) && !/^(#{1,3})\s/.test(lines[index])
           && !lines[index].trim().startsWith('- ') && !/^---+$/.test(lines[index].trim())) {
      paragraph.push(lines[index++])
    }
    blocks.push(<p className="md-p" key={blocks.length}>{inlineMarkdown(paragraph.join(' '))}</p>)
  }

  return blocks
}

function CodeViewer({ snippets, title, onClose }: { snippets: CodeSnippet[]; title: string; onClose: () => void }) {
  const [active, setActive] = useState(0)
  const snippet = snippets[active]
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.documentElement.style.overflow = previousOverflow }
  }, [onClose])
  return <motion.div className="code-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .2 }} role="dialog" aria-modal="true" aria-label={`Código de ${title}`}>
    <div className="code-viewer__bar">
      <span><i />{title} · CÓDIGO</span>
      <button onClick={onClose} aria-label="Fechar visualizador de código">FECHAR <b>✕</b></button>
    </div>
    <div className="code-viewer__tabs" role="tablist">
      {snippets.map((item, index) => <button key={item.label} role="tab" aria-selected={index === active} className={index === active ? 'active' : ''} onClick={() => setActive(index)}>{item.label}</button>)}
    </div>
    <div className="code-viewer__body">
      <div className="code-viewer__meta">
        <span className="code-viewer__path">{snippet.file}</span>
        <p>{snippet.note}</p>
      </div>
      {snippet.lang === 'image'
        ? <div className="code-viewer__figure"><img src={snippet.code} alt={snippet.note} /></div>
        : snippet.lang === 'md'
        ? <div className="code-viewer__doc">{renderMarkdown(snippet.code)}</div>
        : <pre className="code-viewer__code"><code>{snippet.code.split('\n').map((line, index) => <span className="code-line" key={index}><i>{String(index + 1).padStart(2, '0')}</i><em>{highlight(line)}</em></span>)}</code></pre>}
    </div>
    <p className="code-viewer__foot">Trechos do repositório privado, revisados manualmente. Configurações sensíveis são injetadas por variável de ambiente e não aparecem no código.</p>
  </motion.div>
}

function FullscreenPreview({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.documentElement.style.overflow = previousOverflow }
  }, [onClose])
  return <motion.div className="project-fullscreen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} role="dialog" aria-modal="true" aria-label={title}>
    <div className="project-fullscreen__bar">
      <span><i />{title}</span>
      <button onClick={onClose} aria-label="Fechar prévia em tela cheia">FECHAR <b>✕</b></button>
    </div>
    <iframe src={src} title={`${title} em tela cheia`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="no-referrer" />
  </motion.div>
}

export function Projects() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showCode, setShowCode] = useState(false)
  /* Uma vez que a pessoa escolhe um projeto, o autoplay para de vez: continuar
     girando trocaria o card por baixo de quem está lendo ou clicando. */
  const [engaged, setEngaged] = useState(false)
  const project = projects[active]
  const canEmbed = useCanEmbed(project.link)
  const move = (step: number) => { setDirection(step); setActive((current) => (current + step + projects.length) % projects.length) }
  const pick = (step: number) => { setEngaged(true); move(step) }
  /* O relógio só corre com a seção à vista. Antes ele começava no carregamento
     da página, então quem levasse alguns segundos rolando até aqui já chegava
     com o carrossel adiantado — nunca no primeiro projeto. */
  const section = useRef<HTMLElement>(null)
  const sectionInView = useInView(section, { margin: '-25% 0px' })
  useEffect(() => { if (paused || fullscreen || engaged || !sectionInView) return; const timer = window.setInterval(() => move(1), 35000); return () => window.clearInterval(timer) }, [paused, active, fullscreen, engaged, sectionInView])
  return <section ref={section} id="projects" className="section shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><SectionHeading index="02" eyebrow="PORTFOLIO" title="PROJETOS EM DESTAQUE" description="Sistemas em produção que eu construí e mantenho, ao lado de projetos conceituais das minhas áreas de atuação: backend, automação e sistemas embarcados." />
    <Reveal className="project-tilt" delay={.1} scale>
      <Tilt className="" max={2}><article className={`project project--${direction > 0 ? 'next' : 'prev'}`} key={project.title}>
      <div className="project__head"><div><h3>{project.title}</h3><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="project__meta">{project.link && <span className="project__badge"><i />LIVE</span>}<span className="project__number">PROJECT::{project.index}</span></div></div>
      <div className="project__body"><div className={`project__image ${project.link && canEmbed ? 'project__image--live' : ''}`} data-cursor-text={project.link && canEmbed ? '' : 'EXPLORE'}>{project.link && canEmbed
        ? <LivePreview src={project.link} title={project.title} onOpen={() => setFullscreen(true)} />
        : <img src={project.image} alt={`Prévia do projeto ${project.title}`} loading="lazy" decoding="async" />}</div><div className="project__copy"><p>{project.description}</p><h4>SYSTEM HIGHLIGHTS</h4><ul>{project.highlights.map((item) => <li key={item}><b>#</b>{item}</li>)}</ul>
        {/* Sem site ao vivo, o código passa a ser a ação principal do card. */}
        {(project.link || project.codeSnippets?.length) && <div className="project__live">
          {project.link && <button className="project__live-cta" onClick={() => setFullscreen(true)} data-cursor-text="FULL">{project.linkLabel ?? 'TELA CHEIA'} <b>⤢</b></button>}
          {project.codeSnippets?.length ? <button className={project.link ? 'project__live-alt' : 'project__live-cta'} onClick={() => setShowCode(true)} data-cursor-text="CODE">{project.link ? 'CÓDIGO' : 'VER CÓDIGO'} <b>{'{ }'}</b></button> : null}
          {project.extraLinks?.map((extra) => <a className="project__live-alt" href={extra.href} target="_blank" rel="noreferrer noopener" key={extra.href}>{extra.label}</a>)}
        </div>}
      </div></div>
      <div className="project__controls"><span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><div><button aria-label="Projeto anterior" onClick={() => pick(-1)}>←</button><button aria-label="Próximo projeto" onClick={() => pick(1)}>→</button></div></div>
    </article></Tilt>
    </Reveal><div className="project-dots">{projects.map((item, index) => <button aria-label={`Abrir ${item.title}`} className={active === index ? 'active' : ''} onClick={() => { setEngaged(true); setDirection(index > active ? 1 : -1); setActive(index) }} key={item.title} />)}</div>
    {fullscreen && project.link && <FullscreenPreview src={project.link} title={project.title} onClose={() => setFullscreen(false)} />}
    {showCode && project.codeSnippets?.length ? <CodeViewer snippets={project.codeSnippets} title={project.title} onClose={() => setShowCode(false)} /> : null}
  </section>
}

/* ─── GitHub Activity ────────────────────────────────────────────────────── */
const activityCells = Array.from({ length: 364 }, (_, index) => {
  const signal = (index * 17 + index * index * 3 + 11) % 41
  return signal > 36 ? 4 : signal > 31 ? 3 : signal > 24 ? 2 : signal > 15 ? 1 : 0
})

export function GithubActivity() {
  const total = activityCells.reduce<number>((sum, level) => sum + level, 0)
  return <section id="activity" className="section shell activity"><SectionHeading index="03" eyebrow="OPEN SOURCE" title="GITHUB ACTIVITY" />
    <Reveal className="activity-panel" delay={.1} scale>
      <div className="activity-panel__head"><div><span>STATED.FREQ_ANALYSIS</span><b><i /> LIVE_SYNC</b></div><a href="https://github.com/Juli0cso" target="_blank" rel="noreferrer"><GithubIcon /> VIEW_GITHUB</a></div>
      <div className="activity-scroll"><div className="activity-months"><span>AGO</span><span>OUT</span><span>DEZ</span><span>FEV</span><span>ABR</span><span>JUN</span></div><div className="activity-graph" aria-label="Representação visual da atividade no GitHub">{activityCells.map((level, index) => <i tabIndex={0} className={`level-${level}`} data-count={level ? `${level} contribuições` : 'Sem contribuições'} key={index} />)}<b /></div></div>
      <div className="activity-panel__foot"><span>TOTAL: <b>{total}</b></span><div><em>LESS</em>{[0, 1, 2, 3, 4].map((level) => <i className={`level-${level}`} key={level} />)}<em>MORE</em></div></div>
    </Reveal>
  </section>
}

/* ─── Certificates ───────────────────────────────────────────────────────── */
export function Certificates() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const certificate = certificates[active]
  const move = (step: number) => { setDirection(step); setActive((current) => (current + step + certificates.length) % certificates.length) }
  useEffect(() => { if (paused) return; const timer = window.setInterval(() => move(1), 6000); return () => window.clearInterval(timer) }, [paused, active])
  return <section id="certificates" className="section shell certificates" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><SectionHeading index="05" eyebrow="QUALIFICATIONS" title="CERTIFICADOS" description="Cursos e qualificações que complementam minha formação técnica e experiência profissional." />
    <Reveal delay={.1} scale><article className={`certificate-card certificate-card--${direction > 0 ? 'next' : 'prev'}`} key={certificate.title}>
      <div className="certificate-card__image" data-cursor-text="VIEW">
        {certificate.image.endsWith('.pdf') ? (
          <Document file={certificate.image} loading={<div style={{ padding: '2rem', color: '#888' }}>Carregando certificado...</div>}>
            <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={800} />
          </Document>
        ) : (
          <img src={certificate.image} alt={`Placeholder do certificado ${certificate.title}`} loading="lazy" decoding="async" />
        )}
        <span>CERT::{certificate.index}</span>
      </div>
      <div className="certificate-card__copy"><div className="certificate-card__meta"><span>// {certificate.date}</span><b>[ VERIFIED_COURSE ]</b></div><small>{certificate.issuer}</small><h3>{certificate.title}</h3><i /><p>{certificate.description}</p><div className="tags">{certificate.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      <span className="certificate-card__corner certificate-card__corner--tl" /><span className="certificate-card__corner certificate-card__corner--br" />
    </article></Reveal>
    <div className="certificate-controls"><div>{certificates.map((item, index) => <button className={active === index ? 'active' : ''} aria-label={`Abrir certificado ${item.title}`} onClick={() => { setDirection(index > active ? 1 : -1); setActive(index) }} key={item.title} />)}</div><span>{String(active + 1).padStart(2, '00')} / {String(certificates.length).padStart(2, '00')}</span><div><button aria-label="Certificado anterior" onClick={() => move(-1)}>←</button><button aria-label="Próximo certificado" onClick={() => move(1)}>→</button></div></div>
    <small className="certificate-stream">CERT_STREAM_CONNECTED // {certificates.length}_ENTRIES_LOADED</small>
  </section>
}

export function Experience() {
  const modelRef = useRef<any>(null)

  useEffect(() => {
    const model = modelRef.current
    if (!model || customElements.get('model-viewer')) return

    const loadModelViewer = () => {
      if (customElements.get('model-viewer') || document.querySelector('[data-model-viewer-loader]')) return
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
      script.dataset.modelViewerLoader = 'true'
      document.head.appendChild(script)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      loadModelViewer()
      observer.disconnect()
    }, { rootMargin: '1000px' })

    observer.observe(model)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const model = modelRef.current
    if (!model) return

    // Removed allowMotion matchMedia to ensure it always tracks on desktop/mouse move.

    let frame = 0
    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { rootMargin: '150px' })
    observer.observe(model)

    const move = (e: MouseEvent) => {
      if (!visible) return
      const { clientX, clientY } = e
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!modelRef.current || !customElements.get('model-viewer')) return
        const x = (clientX / window.innerWidth - 0.5) * 2
        const y = (clientY / window.innerHeight - 0.5) * 2
        const theta = x * -12
        const phi = 90 + y * 10
        modelRef.current.cameraOrbit = `${theta}deg ${phi}deg auto`
      })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return <section id="experience" className="section shell"><SectionHeading index="04" eyebrow="EXPERIENCE" title="MINHA JORNADA" />
    <Reveal className="journey" delay={.1}>
      <div className="journey__portrait" style={{ background: 'transparent' }} data-cursor-text="JÚLIO">
        <model-viewer 
          ref={modelRef}
          src="/gordao-low-depth-portrait.glb" 
          alt="3D Portrait of Júlio César" 
          loading="lazy"
          disable-zoom
          disable-pan
          interaction-prompt="none"
          orientation="180deg 0deg 0deg"
          style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: 'transparent' }}
        ></model-viewer>
        <span>gordao-low-depth-portrait.glb</span>
      </div>
      <div className="timeline">{experiences.map((experience, index) => (
        <Reveal key={experience.role} delay={index * .12}>
          <article className="timeline-item" style={{ '--tone': experience.tone, '--delay': `${index * 120}ms` } as React.CSSProperties}><i /><div className="timeline__head"><div><h3>{experience.role}</h3><span>{experience.date}</span></div><b>{experience.status}</b></div><h4>{experience.company}</h4><ul>{experience.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </Reveal>
      ))}</div>
    </Reveal>
  </section>
}

/* ─── Education ──────────────────────────────────────────────────────────── */
export function Education() {
  return <section id="education" className="section shell"><SectionHeading index="06" eyebrow="ACADEMIC_LOG" title="FORMAÇÃO ACADÊMICA" />
    <Reveal delay={.1} scale>
      <article className="education-card"><div className="education-card__meta"><span>// 2023 — 2027</span><b>STATUS: EM_ANDAMENTO</b></div><h3>GRADUAÇÃO EM ENGENHARIA DA COMPUTAÇÃO</h3><p>UNICEUB — CENTRO UNIVERSITÁRIO DE BRASÍLIA · ASA NORTE</p><div className="education-card__line"><span>Cursando o 8º semestre</span><span>PREVISÃO DE CONCLUSÃO: JULHO/2027</span></div><div className="education-progress"><i /></div><small>ACADEMIC.PROGRESS / 08_OF_10_SEMESTERS</small></article>
    </Reveal>
  </section>
}

/* ─── Contact ────────────────────────────────────────────────────────────── */
/* O formulário usava action="mailto:" com method="post": o navegador ou abre o
   cliente de e-mail com o corpo embaralhado, ou não faz nada — e quem preencheu
   sai achando que enviou. Aqui o envio é uma requisição de verdade.

   O endereço do serviço vem de VITE_CONTACT_ENDPOINT (Formspree, Web3Forms e
   afins aceitam FormData direto). Sem ele configurado, caímos num mailto bem
   montado, que ao menos abre o e-mail já preenchido em vez de falhar calado. */
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined
const CONTACT_EMAIL = 'jc.nizuu@gmail.com'

type SendState = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const [state, setState] = useState<SendState>('idle')

  const abrirEmail = (data: FormData) => {
    const assunto = `Contato pelo portfólio — ${data.get('name')}`
    const corpo = `${data.get('message')}\n\n—\n${data.get('name')}\n${data.get('email')}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    /* Campo isca, invisível para gente e irresistível para robô de spam. O nome
       `_gotcha` é a convenção do Formspree, então ele também filtra do lado
       dele — a checagem aqui vale para qualquer outro serviço. */
    if (data.get('_gotcha')) return

    if (!CONTACT_ENDPOINT) return abrirEmail(data)

    setState('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  const enviando = state === 'sending'

  return <form className="contact-form" onSubmit={submit} noValidate={false}>
    <h3>SEND MESSAGE</h3>
    <label><span>[ NOME ]</span><input name="name" required disabled={enviando} /></label>
    <label><span>[ EMAIL_ADDRESS ]</span><input type="email" name="email" required disabled={enviando} /></label>
    <label><span>[ DATA_PAYLOAD ]</span><textarea name="message" rows={6} required disabled={enviando} /></label>
    <input className="contact-form__trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button type="submit" disabled={enviando}>
      {enviando ? '[ ENVIANDO... ]' : '[ SEND MESSAGE ]'} <ArrowIcon size={14} />
    </button>
    <p className={`contact-form__status is-${state}`} role="status" aria-live="polite">
      {state === 'sent' && 'Mensagem enviada. Respondo assim que puder.'}
      {state === 'error' && <>Não consegui enviar agora. Escreva direto para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}
    </p>
  </form>
}

export function Contact() {
  return <section id="contact" className="section shell"><SectionHeading index="06" eyebrow="GET IN TOUCH" title="CONTACT ME" />
    <Reveal className="contact-grid" delay={.1}>
      <Reveal className="contact-copy" direction="left" delay={.15}><h3>Let's start a conversation</h3><p>Have a project in mind, an opportunity or want to talk about backend, automation and technology? I'm available to build something relevant.</p>
        <a href="mailto:jc.nizuu@gmail.com"><i><MailIcon /></i><span><small>Email</small>jc.nizuu@gmail.com</span></a>
        <a href="tel:+5561985695532"><i><PhoneIcon /></i><span><small>Telefone</small>+55 (61) 98569-5532</span></a>
        <div className="contact-social"><span>CONNECT</span><a href="https://github.com/Juli0cso" target="_blank"><GithubIcon /></a><a href="https://www.linkedin.com/in/juli0cso/" target="_blank"><LinkedinIcon /></a></div>
      </Reveal>
      <Reveal direction="right" delay={.25} scale>
        <ContactForm />
      </Reveal>
    </Reveal>
  </section>
}
