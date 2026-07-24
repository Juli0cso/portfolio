import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type LoadingPhase = 'loading' | 'exit' | 'done'

const LOADER_EASE = [0.76, 0, 0.24, 1] as const

export default function LoadingScreen() {
  const [phase, setPhase] = useState<LoadingPhase>('loading')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressDuration = 1200
    const exitDelay = 3200
    const finishDelay = 4000
    const startedAt = performance.now()
    let frame = 0

    const updateProgress = (now: number) => {
      const elapsed = now - startedAt
      const amount = Math.min(elapsed / progressDuration, 1)
      const eased = amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
      setProgress(Math.floor(eased * 100))

      if (amount < 1) {
        frame = requestAnimationFrame(updateProgress)
      } else {
        setProgress(100)
      }
    }

    frame = requestAnimationFrame(updateProgress)
    const exitTimer = window.setTimeout(() => setPhase('exit'), exitDelay)
    const finishTimer = window.setTimeout(() => setPhase('done'), finishDelay)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(exitTimer)
      window.clearTimeout(finishTimer)
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
                delay: exiting ? 0 : 0.8,
                duration: exiting ? 0.65 : 1.2,
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
                delay: exiting ? 0.1 : 1.2,
                duration: 0.8,
                ease: LOADER_EASE,
              }}
            >
              {progress}%
            </motion.span>
          </div>
        </div>

        <div className="loading-screen__line">
          <motion.i
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={exiting
              ? { scaleX: 0, opacity: 0, transformOrigin: 'right' }
              : { scaleX: 1, opacity: 1, transformOrigin: 'left' }}
            transition={{ duration: exiting ? 0.6 : 1.5, ease: LOADER_EASE }}
          />
        </div>

        <div className="loading-screen__bottom">
          <div className="loading-screen__clip">
            <motion.p
              className="loading-screen__roles"
              initial={{ y: '-150%', rotateX: 40, opacity: 0, filter: 'blur(10px)' }}
              animate={exiting
                ? { y: '100%', rotateX: 0, opacity: 0, filter: 'blur(10px)' }
                : { y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                delay: exiting ? 0.05 : 0.9,
                duration: exiting ? 0.65 : 1.2,
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
                delay: exiting ? 0.15 : 1.3,
                duration: 1,
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
