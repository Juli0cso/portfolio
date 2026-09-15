import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type LoadingPhase = 'loading' | 'exit' | 'done'

const LOADER_EASE = [0.76, 0, 0.24, 1] as const

/* Cada marco real do boot vale um pedaço da barra; a soma dá 100. */
const WEIGHTS = { boot: 16, fonts: 26, assets: 34, minTime: 24 }

const MIN_DURATION = 1800
const FONTS_TIMEOUT = 2000
const ASSETS_TIMEOUT = 2600
const HARD_TIMEOUT = 5000
const HOLD_AT_FULL = 350

const STAGES = [
  'INICIANDO RUNTIME',
  'CARREGANDO TIPOGRAFIA',
  'MONTANDO INTERFACE',
  'FINALIZANDO',
  'PRONTO',
] as const

const STAGE_AT = [0, 26, 58, 86, 100]

function stageIndexFor(progress: number) {
  let index = 0
  for (let i = 0; i < STAGE_AT.length; i += 1) {
    if (progress >= STAGE_AT[i]) index = i
  }
  return index
}

export default function LoadingScreen() {
  const [phase, setPhase] = useState<LoadingPhase>('loading')
  const [progress, setProgress] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minDuration = reduced ? 500 : MIN_DURATION
    const startedAt = performance.now()

    const done = { boot: false, fonts: false, assets: false, minTime: false }
    let target = 0
    let current = 0
    let last = startedAt
    let frame = 0
    let finished = false

    const milestoneTotal = () =>
      (done.boot ? WEIGHTS.boot : 0) +
      (done.fonts ? WEIGHTS.fonts : 0) +
      (done.assets ? WEIGHTS.assets : 0) +
      (done.minTime ? WEIGHTS.minTime : 0)

    const allDone = () => done.boot && done.fonts && done.assets && done.minTime

    const complete = () => {
      if (finished) return
      finished = true
      setProgress(100)
      timers.current.push(
        window.setTimeout(() => setPhase('exit'), HOLD_AT_FULL),
        window.setTimeout(() => setPhase('done'), HOLD_AT_FULL + (reduced ? 200 : 800)),
      )
    }

    const tick = (now: number) => {
      /* Teto alto no dt: em aba de fundo o rAF rareia e a barra travaria. */
      const dt = Math.min(now - last, 250)
      last = now

      if (!done.minTime && now - startedAt >= minDuration) done.minTime = true

      const base = milestoneTotal()
      /* Entre marcos a barra ainda anda, mas nunca alcança o próximo. */
      const ceiling = allDone() ? 100 : Math.min(base + 9, 96)
      target = Math.min(ceiling, Math.max(target, base) + dt * 0.014)

      /* Persegue o alvo: salta ao concluir um marco e desacelera na espera. */
      current += (target - current) * (1 - Math.exp(-dt / 190))
      setProgress(Math.min(100, Math.round(current)))

      if (allDone() && current >= 99.4) {
        complete()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    /* Marco 1: React montou e pintou o primeiro quadro. */
    requestAnimationFrame(() => { done.boot = true })

    /* Marco 2: fontes prontas — é quando o layout para de dançar. */
    const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fontSet) {
      fontSet.ready.then(() => { done.fonts = true }).catch(() => { done.fonts = true })
    } else {
      done.fonts = true
    }
    timers.current.push(window.setTimeout(() => { done.fonts = true }, FONTS_TIMEOUT))

    /* Marco 3: imagens, CSS externo e o resto dos assets da página. */
    const markAssets = () => { done.assets = true }
    if (document.readyState === 'complete') markAssets()
    else window.addEventListener('load', markAssets, { once: true })
    timers.current.push(window.setTimeout(markAssets, ASSETS_TIMEOUT))

    /* Rede ruim não pode prender o visitante na porta de entrada. */
    timers.current.push(window.setTimeout(() => {
      done.boot = true
      done.fonts = true
      done.assets = true
      done.minTime = true
    }, HARD_TIMEOUT))

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', markAssets)
      timers.current.forEach(window.clearTimeout)
      timers.current = []
    }
  }, [])

  useEffect(() => {
    if (phase === 'done') return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [phase])

  if (phase === 'done') return null

  const exiting = phase === 'exit'
  const stage = stageIndexFor(progress)

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={exiting
        ? { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
        : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: exiting ? 0.8 : 0, ease: LOADER_EASE }}
      aria-label="Carregando portfólio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      role="progressbar"
    >
      <div className="loading-screen__grain" />
      <div className="loading-screen__vignette" />

      <div className="loading-screen__content">
        <div className="loading-screen__top">
          <div className="loading-screen__clip">
            <motion.h1
              initial={{ y: '150%', rotateX: -40, opacity: 0, filter: 'blur(10px)' }}
              animate={exiting
                ? { y: '-100%', rotateX: 0, opacity: 0, filter: 'blur(10px)' }
                : { y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                delay: exiting ? 0 : 0.1,
                duration: exiting ? 0.65 : 1,
                ease: LOADER_EASE,
              }}
            >
              JÚLIO CÉSAR
            </motion.h1>
          </div>

          <div className="loading-screen__clip loading-screen__progress-clip">
            <motion.span
              className="loading-screen__progress"
              initial={{ y: '100%', opacity: 0 }}
              animate={exiting
                ? { y: '-100%', opacity: 0 }
                : { y: 0, opacity: 1 }}
              transition={{
                delay: exiting ? 0.1 : 0.3,
                duration: 0.7,
                ease: LOADER_EASE,
              }}
            >
              {String(progress).padStart(3, '0')}%
            </motion.span>
          </div>
        </div>

        <motion.div
          className="loading-screen__bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ delay: exiting ? 0 : 0.25, duration: 0.5, ease: LOADER_EASE }}
        >
          <div
            className="loading-screen__bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
          <div
            className="loading-screen__bar-head"
            style={{ left: `${progress}%`, opacity: progress > 1 && progress < 100 ? 1 : 0 }}
          />
          <div className="loading-screen__bar-ticks" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => <i key={i} />)}
          </div>
        </motion.div>

        <motion.div
          className="loading-screen__status"
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ delay: exiting ? 0 : 0.45, duration: 0.5, ease: LOADER_EASE }}
        >
          <span className="loading-screen__status-label">
            <i className="loading-screen__status-dot" data-complete={progress >= 100} />
            <span className="loading-screen__clip loading-screen__status-clip">
              {/* A key remonta o rótulo a cada etapa: o texto novo sobe do corte. */}
              <motion.b
                key={stage}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: LOADER_EASE }}
              >
                {STAGES[stage]}
              </motion.b>
            </span>
          </span>
          <span className="loading-screen__status-count">
            {String(stage + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="loading-screen__bottom">
          <div className="loading-screen__clip">
            <motion.p
              className="loading-screen__roles"
              initial={{ y: '-150%', rotateX: 40, opacity: 0, filter: 'blur(10px)' }}
              animate={exiting
                ? { y: '100%', rotateX: 0, opacity: 0, filter: 'blur(10px)' }
                : { y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                delay: exiting ? 0.05 : 0.2,
                duration: exiting ? 0.65 : 1,
                ease: LOADER_EASE,
              }}
            >
              ENGENHARIA DA COMPUTAÇÃO <b>•</b> BACKEND JAVA
            </motion.p>
          </div>

          <div className="loading-screen__clip">
            <motion.small
              initial={{ y: '-150%', opacity: 0 }}
              animate={exiting
                ? { y: '100%', opacity: 0 }
                : { y: 0, opacity: 1 }}
              transition={{
                delay: exiting ? 0.15 : 0.5,
                duration: 0.9,
                ease: LOADER_EASE,
              }}
            >
              PORTFOLIO // INIT
            </motion.small>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
