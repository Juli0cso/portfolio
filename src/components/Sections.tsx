import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
import { certificates, experiences, projects, skills, type Skill } from '../data/portfolio'
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
export function Projects() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const project = projects[active]
  const move = (step: number) => { setDirection(step); setActive((current) => (current + step + projects.length) % projects.length) }
  useEffect(() => { if (paused) return; const timer = window.setInterval(() => move(1), 5000); return () => window.clearInterval(timer) }, [paused, active])
  return <section id="projects" className="section shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><SectionHeading index="02" eyebrow="PORTFOLIO" title="PROJETOS EM DESTAQUE" description="Projetos conceituais baseados nas minhas principais áreas de atuação: backend, automação e sistemas embarcados." />
    <Reveal className="project-tilt" delay={.1} scale>
      <Tilt className="" max={2}><article className={`project project--${direction > 0 ? 'next' : 'prev'}`} key={project.title}>
      <div className="project__head"><div><h3>{project.title}</h3><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="project__number">PROJECT::{project.index}</span></div>
      <div className="project__body"><div className="project__image" data-cursor-text="EXPLORE"><img src={project.image} alt={`Placeholder do projeto ${project.title}`} loading="lazy" decoding="async" /></div><div className="project__copy"><p>{project.description}</p><h4>SYSTEM HIGHLIGHTS</h4><ul>{project.highlights.map((item) => <li key={item}><b>#</b>{item}</li>)}</ul></div></div>
      <div className="project__controls"><span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><div><button aria-label="Projeto anterior" onClick={() => move(-1)}>←</button><button aria-label="Próximo projeto" onClick={() => move(1)}>→</button></div></div>
    </article></Tilt>
    </Reveal><div className="project-dots">{projects.map((item, index) => <button aria-label={`Abrir ${item.title}`} className={active === index ? 'active' : ''} onClick={() => { setDirection(index > active ? 1 : -1); setActive(index) }} key={item.title} />)}</div>
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
        <span>IMAGE_SLOT::{certificate.index}</span>
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
export function Contact() {
  return <section id="contact" className="section shell"><SectionHeading index="06" eyebrow="GET IN TOUCH" title="CONTACT ME" />
    <Reveal className="contact-grid" delay={.1}>
      <Reveal className="contact-copy" direction="left" delay={.15}><h3>Let's start a conversation</h3><p>Have a project in mind, an opportunity or want to talk about backend, automation and technology? I'm available to build something relevant.</p>
        <a href="mailto:jc.nizuu@gmail.com"><i><MailIcon /></i><span><small>Email</small>jc.nizuu@gmail.com</span></a>
        <a href="tel:+5561985695532"><i><PhoneIcon /></i><span><small>Telefone</small>+55 (61) 98569-5532</span></a>
        <div className="contact-social"><span>CONNECT</span><a href="https://github.com/Juli0cso" target="_blank"><GithubIcon /></a><a href="https://www.linkedin.com/in/juli0cso/" target="_blank"><LinkedinIcon /></a></div>
      </Reveal>
      <Reveal direction="right" delay={.25} scale>
        <form className="contact-form" action="mailto:jc.nizuu@gmail.com" method="post" encType="text/plain"><h3>SEND MESSAGE</h3><label><span>[ NOME ]</span><input name="name" required /></label><label><span>[ EMAIL_ADDRESS ]</span><input type="email" name="email" required /></label><label><span>[ DATA_PAYLOAD ]</span><textarea name="message" rows={6} required /></label><button type="submit">[ SEND MESSAGE ] <ArrowIcon size={14} /></button></form>
      </Reveal>
    </Reveal>
  </section>
}
