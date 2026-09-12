import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

const getScrollRoot = () => {
  if (typeof document === 'undefined') return null
  return document.getElementById('container-inner') || document.scrollingElement
}

/**
 * 跳转到网页顶部
 * 首页主栏是内部滚动容器，不能只听 window。
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)

  useEffect(() => {
    const root = getScrollRoot()
    if (!root) return undefined

    const onScroll = () => {
      const top = root === document.scrollingElement ? window.pageYOffset : root.scrollTop
      switchShow(top > 200)
    }

    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })
    if (root !== document.scrollingElement) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleClick = () => {
    const root = getScrollRoot()
    if (root && root !== document.scrollingElement) {
      root.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type='button'
      title={locale.POST.TOP}
      aria-label={locale.POST.TOP}
      className={`claude-jump-top${show ? ' is-visible' : ''}`}
      onClick={handleClick}>
      <i className='fas fa-angle-up' aria-hidden='true' />
    </button>
  )
}

export default JumpToTopButton
