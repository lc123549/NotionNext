import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import throttle from 'lodash.throttle'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import DarkModeButton from './DarkModeButton'
import { getClaudeMenuLinks } from './menu'
import { markIntroDone } from './HomeIntro'

const AVATAR = '/images/custom/claude-cat.jpg'

/**
 * 文章页顶栏：叠在蓝浪头图上，滚动后变白底。
 */
export default function PostTopNav({ customNav, customMenu, onSearch }) {
  const { locale } = useGlobal()
  const router = useRouter()
  const [navBgWhite, setNavBgWhite] = useState(false)
  const links = getClaudeMenuLinks({ locale, customNav, customMenu }).filter(
    link => link?.show !== false
  )

  const scrollTrigger = useMemo(
    () =>
      throttle(() => {
        setNavBgWhite(window.scrollY > 1)
      }, 100),
    []
  )

  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger, { passive: true })
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      scrollTrigger.cancel?.()
    }
  }, [scrollTrigger, router.asPath])

  const handleSearch = () => {
    if (onSearch) {
      onSearch()
      return
    }
    router.push('/search')
  }

  const goHome = () => {
    markIntroDone()
  }

  return (
    <nav
      id='post-top-nav'
      className={`z-30 h-16 top-0 w-full fixed duration-300 transition-all ${
        navBgWhite
          ? 'bg-white dark:bg-[#18171d] shadow text-black dark:text-white'
          : 'bg-transparent text-white'
      }`}>
      <div className='flex h-full mx-auto items-center justify-between max-w-[86rem] px-6 gap-4'>
        <SmartLink
          href='/'
          onClick={goHome}
          className='flex items-center gap-2 font-light text-lg tracking-wide min-w-0'>
          <LazyImage
            src={AVATAR}
            alt={siteConfig('CLAUDE_BLOG_NAME')}
            width={32}
            height={32}
            className='w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/40'
          />
          <span className='truncate'>{siteConfig('CLAUDE_BLOG_NAME')}</span>
        </SmartLink>

        <div className='flex items-center gap-2 shrink-0'>
          <div className='hidden md:flex items-center gap-5 font-light text-sm'>
            <button
              type='button'
              title={locale.NAV.SEARCH}
              aria-label={locale.NAV.SEARCH}
              onClick={handleSearch}
              className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200'>
              <i className='fa-solid fa-magnifying-glass' />
            </button>
            {links.slice(0, 6).map(link => (
              <SmartLink
                key={link.id}
                href={link.href}
                onClick={link.href === '/' ? goHome : undefined}
                className='hover:opacity-80 duration-200 whitespace-nowrap'>
                {link.name}
              </SmartLink>
            ))}
          </div>
          <button
            type='button'
            title={locale.NAV.SEARCH}
            aria-label={locale.NAV.SEARCH}
            onClick={handleSearch}
            className='md:hidden cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200'>
            <i className='fa-solid fa-magnifying-glass' />
          </button>
          <DarkModeButton className={navBgWhite ? '' : 'post-nav-light'} />
        </div>
      </div>
    </nav>
  )
}
