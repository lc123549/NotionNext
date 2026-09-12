import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import throttle from 'lodash.throttle'
import SmartLink from '@/components/SmartLink'
import DarkModeButton from './DarkModeButton'
import { getClaudeMenuLinks } from './menu'

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

  return (
    <nav
      id='post-top-nav'
      className={`z-30 h-16 top-0 w-full fixed duration-300 transition-all ${
        navBgWhite
          ? 'bg-white dark:bg-[#18171d] shadow text-black dark:text-white'
          : 'bg-transparent text-white'
      }`}>
      <div className='flex h-full mx-auto justify-between items-center max-w-[86rem] px-6'>
        <SmartLink href='/' className='font-light text-lg tracking-wide shrink-0'>
          {siteConfig('CLAUDE_BLOG_NAME')}
        </SmartLink>

        <div className='hidden md:flex items-center gap-6 font-light text-sm'>
          {links.slice(0, 6).map(link => (
            <SmartLink
              key={link.id}
              href={link.href}
              className='hover:opacity-80 duration-200 whitespace-nowrap'>
              {link.name}
            </SmartLink>
          ))}
        </div>

        <div className='flex items-center gap-1'>
          <button
            type='button'
            title={locale.NAV.SEARCH}
            aria-label={locale.NAV.SEARCH}
            onClick={handleSearch}
            className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200'>
            <i className='fa-solid fa-magnifying-glass' />
          </button>
          <DarkModeButton className={navBgWhite ? '' : 'post-nav-light'} />
        </div>
      </div>
    </nav>
  )
}
