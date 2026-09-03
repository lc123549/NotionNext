import SmartLink from '@/components/SmartLink'
import { useMemo } from 'react'

const HOME_LINKS = [
  { href: '/archive', label: '归档', icon: 'fas fa-archive' },
  { href: '/category', label: '分类', icon: 'fas fa-folder' },
  { href: '/tag', label: '标签', icon: 'fas fa-tag' }
]

const isReadmeLikePage = page => {
  if (!page) return false
  const slug = String(page.slug || '')
  const last = slug.split('/').filter(Boolean).pop()
  return last === 'readme.md'
}

const isPlaceholderErrorPost = post => {
  if (!post) return true
  if (post.slug === 'oops') return true
  return String(post.title || '').includes('无法获取Notion数据')
}

export default function ProfileHome(props) {
  const { posts = [], latestPosts = [] } = props

  const recentPosts = useMemo(() => {
    const source = (latestPosts.length ? latestPosts : posts) || []
    return source
      .filter(post => post && !isReadmeLikePage(post) && !isPlaceholderErrorPost(post))
      .slice(0, 6)
  }, [latestPosts, posts])

  return (
    <div className='claude-lounge'>
      <div className='claude-lounge-capsules'>
        {HOME_LINKS.map(link => (
          <SmartLink key={link.href} href={link.href} className='claude-lounge-capsule'>
            <i className={`${link.icon} claude-lounge-capsule-icon`} aria-hidden='true' />
            <span>{link.label}</span>
          </SmartLink>
        ))}
      </div>

      {recentPosts.length > 0 && (
        <section className='claude-lounge-recent'>
          <h2 className='claude-lounge-recent-title'>最近</h2>
          <div className='claude-lounge-recent-list'>
            {recentPosts.map(post => (
              <SmartLink
                key={post.id || post.slug}
                href={post.href || `/${post.slug}`}
                className='claude-lounge-post'>
                <span className='claude-lounge-post-title'>{post.title || '未命名'}</span>
                <span className='claude-lounge-post-meta'>
                  {post.publishDay && <span>{post.publishDay}</span>}
                  {post.category && <span>{post.category}</span>}
                </span>
                {post.summary && (
                  <span className='claude-lounge-post-summary'>{post.summary}</span>
                )}
              </SmartLink>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
