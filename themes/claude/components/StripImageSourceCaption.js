import { useEffect } from 'react'

const SOURCE_TAIL = /\s*图[:：][\s\S]*$/

function cleanCaption(el) {
  if (!(el instanceof HTMLElement) || el.dataset.captionCleaned === '1') {
    return
  }

  const text = (el.textContent || '').replace(/\u00a0/g, ' ').trim()
  if (!SOURCE_TAIL.test(text)) {
    el.dataset.captionCleaned = '1'
    return
  }

  const cleaned = text.replace(SOURCE_TAIL, '').trim()
  if (!cleaned) {
    el.style.display = 'none'
  } else if (cleaned !== text) {
    el.textContent = cleaned
  }
  el.dataset.captionCleaned = '1'
}

/**
 * 保留配图说明，去掉末尾的「图：来源 / 文件名」。
 */
export default function StripImageSourceCaption() {
  useEffect(() => {
    const root = document.getElementById('article-wrapper')
    if (!root) return undefined

    const run = () => {
      root.querySelectorAll('.notion-asset-caption, figcaption').forEach(cleanCaption)
    }

    run()
    const observer = new MutationObserver(run)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
