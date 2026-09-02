import { siteConfig } from '@/lib/config'
import { resolveContactEmail } from '@/lib/plugins/mailEncrypt'
import LazyImage from '@/components/LazyImage'
import { MenuList } from './MenuList'
import SmartLink from '@/components/SmartLink'

const getGithubUsername = githubUrl => {
  if (!githubUrl || typeof githubUrl !== 'string') {
    return ''
  }

  try {
    const { pathname } = new URL(githubUrl)
    return pathname.replace(/^\/+|\/+$/g, '')
  } catch (error) {
    return githubUrl.replace(/^https?:\/\/github\.com\//, '').replace(/^\/+|\/+$/g, '')
  }
}

/**
 * 左侧资料栏：小头像 + 毛玻璃导航胶囊
 */
export default function NavBar(props) {
  const avatar = '/images/custom/claude-cat.jpg'
  const blogName = siteConfig('CLAUDE_BLOG_NAME')
  const author = siteConfig('AUTHOR') || blogName
  const bio = siteConfig('BIO')
  const githubUrl = siteConfig('CONTACT_GITHUB')
  const githubLabel = getGithubUsername(githubUrl) || githubUrl?.replace(/^https?:\/\//, '')
  const profileEmail = resolveContactEmail(siteConfig('CONTACT_EMAIL'))
  const hasContact = Boolean(githubUrl || profileEmail)

  return (
    <>
      <div className='hidden md:block'>
        <div className='claude-sidebar-profile'>
          <div className='claude-profile-avatar-wrap'>
            <LazyImage
              src={avatar}
              alt={author}
              width={108}
              height={108}
              className='claude-profile-avatar'
              priority
            />
          </div>

          <div className='claude-profile-heading'>
            <div className='claude-profile-name'>{author}</div>
          </div>

          {bio && <div className='claude-profile-bio'>{bio}</div>}

          {hasContact && (
            <section className='claude-profile-section claude-profile-contact-section'>
              {githubUrl && (
                <SmartLink href={githubUrl} className='claude-profile-contact-row'>
                  <i className='fab fa-github claude-profile-contact-icon' />
                  <span className='claude-profile-contact-value'>{githubLabel}</span>
                </SmartLink>
              )}
              {profileEmail && (
                <a href={`mailto:${profileEmail}`} className='claude-profile-contact-row'>
                  <i className='far fa-envelope claude-profile-contact-icon' />
                  <span className='claude-profile-contact-value'>{profileEmail}</span>
                </a>
              )}
            </section>
          )}

          <section className='claude-profile-section claude-profile-nav-section'>
            <MenuList {...props} />
          </section>
        </div>
      </div>

      <div className='flex flex-col gap-6 md:hidden'>
        <header className='px-1'>
          <SmartLink href='/'>
            <div className='claude-site-title' id='blog-name'>
              {blogName}
            </div>
          </SmartLink>
        </header>

        <nav>
          <MenuList {...props} />
        </nav>
      </div>
    </>
  )
}
