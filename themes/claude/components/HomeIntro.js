import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

const STORAGE_KEY = 'claude-home-intro-v3'
const INTRO_SCRIPT = `try{var q=new URLSearchParams(location.search).get('intro');if(q==='1'){}else if(q==='0'||sessionStorage.getItem('${STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.claudeIntro='done'}}catch(e){}`

export const homeIntroHeadScript = {
  __html: INTRO_SCRIPT
}

const markIntroDone = () => {
  try {
    const forced = new URLSearchParams(window.location.search).get('intro') === '1'
    if (!forced) sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {}
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.claudeIntro = 'done'
    document.documentElement.classList.remove('claude-intro-lock')
  }
}

const shouldSkipIntro = () => {
  if (typeof window === 'undefined') return false
  const forced = new URLSearchParams(window.location.search).get('intro')
  if (forced === '1') return false
  if (forced === '0') return true
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return true
  } catch {}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const sidebarTargetWidth = () => {
  if (!window.matchMedia('(min-width: 768px)').matches) return null
  const sidebar = document.querySelector('.claude-sidebar')
  if (!sidebar) return null
  const width = sidebar.getBoundingClientRect().width
  return width > 0 ? Math.round(width) : null
}

/**
 * 开场林子铺满，名字和中号数字同一行；
 * 结束后收到左侧栏，露出后面的主栏。
 */
export default function HomeIntro() {
  const name = siteConfig('CLAUDE_BLOG_NAME', 'DMA梦', CONFIG)
  const overlayRef = useRef(null)
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState('boot')
  const [progress, setProgress] = useState(0)

  const finish = () => {
    markIntroDone()
    setVisible(false)
  }

  const leave = () => {
    const node = overlayRef.current
    const width = sidebarTargetWidth()
    if (node && width) {
      node.style.setProperty('--intro-target-w', `${width}px`)
      setPhase('exiting')
      return
    }
    setPhase('revealing')
  }

  useEffect(() => {
    if (shouldSkipIntro()) {
      markIntroDone()
      setVisible(false)
      return undefined
    }

    document.documentElement.classList.add('claude-intro-lock')
    const boot = window.requestAnimationFrame(() => setPhase('ready'))
    return () => {
      window.cancelAnimationFrame(boot)
      document.documentElement.classList.remove('claude-intro-lock')
    }
  }, [])

  useEffect(() => {
    if (phase !== 'ready') return undefined

    const duration = 4200
    const hold = 560
    const started = performance.now()
    let frame
    let holdTimer
    const tick = now => {
      const t = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - t) ** 2.15
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        holdTimer = window.setTimeout(leave, hold)
      }
    }
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(holdTimer)
    }
  }, [phase])

  useEffect(() => {
    const node = overlayRef.current
    if (!node) return undefined

    if (phase === 'exiting') {
      const wait = window.setTimeout(() => setPhase('leaving'), 280)
      return () => window.clearTimeout(wait)
    }

    if (phase === 'leaving') {
      const onEnd = event => {
        if (event.target === node && event.propertyName === 'width') setPhase('revealing')
      }
      node.addEventListener('transitionend', onEnd)
      const fallback = window.setTimeout(() => setPhase('revealing'), 1400)
      return () => {
        node.removeEventListener('transitionend', onEnd)
        window.clearTimeout(fallback)
      }
    }

    if (phase === 'revealing') {
      const onEnd = event => {
        if (event.target === node && event.propertyName === 'opacity') finish()
      }
      node.addEventListener('transitionend', onEnd)
      const fallback = window.setTimeout(finish, 700)
      return () => {
        node.removeEventListener('transitionend', onEnd)
        window.clearTimeout(fallback)
      }
    }

    return undefined
  }, [phase])

  if (!visible) return null

  return (
    <>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        <link rel='preconnect' href='https://cdn.jsdelivr.net' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css'
          rel='stylesheet'
        />
      </Head>
      <div
        ref={overlayRef}
        className={`claude-intro${phase !== 'boot' ? ' is-ready' : ''}${phase === 'exiting' ? ' is-exiting' : ''}${phase === 'leaving' ? ' is-leaving' : ''}${phase === 'revealing' ? ' is-revealing' : ''}`}
        role='dialog'
        aria-label='进入站点'
        aria-modal='true'>
        <div className='claude-intro-veil' aria-hidden='true' />
        <button type='button' className='claude-intro-skip' onClick={finish}>
          跳过
        </button>
        <div className='claude-intro-copy' aria-live='polite' aria-atomic='true'>
          <p className='claude-intro-brand'>{name}</p>
          <span className='claude-intro-count'>{progress}%</span>
        </div>
      </div>
    </>
  )
}
