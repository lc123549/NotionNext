import { useEffect, useRef, useState } from 'react'
import Catalog from './Catalog'

const PIN_TOP = 80

/**
 * 文章目录：滚到正文区后用 fixed 钉在顶栏下。
 * 全站 html { overflow-x: hidden } 会让 sticky 失效，所以不用 sticky。
 */
export default function PostTocRail({ post }) {
  const slotRef = useRef(null)
  const cardRef = useRef(null)
  const heightRef = useRef(0)
  const pinnedRef = useRef(false)
  const [pinned, setPinned] = useState(false)
  const [box, setBox] = useState({ left: 0, width: 288, height: 0 })

  useEffect(() => {
    const update = () => {
      const slot = slotRef.current
      const card = cardRef.current
      if (!slot) return

      if (card && !pinnedRef.current) {
        heightRef.current = card.offsetHeight
      }

      const rect = slot.getBoundingClientRect()
      setBox({
        left: rect.left,
        width: rect.width,
        height: heightRef.current || card?.offsetHeight || 0
      })

      const nextPinned = rect.top <= PIN_TOP
      pinnedRef.current = nextPinned
      setPinned(nextPinned)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [post?.id])

  return (
    <aside ref={slotRef} className='hidden xl:block w-72 shrink-0'>
      <div
        ref={cardRef}
        className='claude-toc-card'
        style={
          pinned
            ? {
                position: 'fixed',
                top: '5rem',
                left: box.left,
                width: box.width,
                maxHeight: 'calc(100vh - 6.5rem)',
                overflowY: 'auto',
                zIndex: 20
              }
            : undefined
        }>
        <Catalog post={post} scrollMode='window' />
      </div>
      {pinned ? <div aria-hidden style={{ height: box.height }} /> : null}
    </aside>
  )
}
