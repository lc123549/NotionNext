import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { BlogItem } from './BlogItem'

const HOME_LINKS = [
  { href: '/archive', label: '归档' },
  { href: '/category', label: '分类' },
  { href: '/tag', label: '标签' }
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
  const { posts = [], latestPosts = [], categoryOptions = [] } = props
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('')

  const allPosts = useMemo(() => {
    const source = (posts.length ? posts : latestPosts) || []
    return source.filter(
      post => post && !isReadmeLikePage(post) && !isPlaceholderErrorPost(post)
    )
  }, [latestPosts, posts])

  const visiblePosts = useMemo(() => {
    if (!activeCategory) return allPosts
    return allPosts.filter(post => post.category === activeCategory)
  }, [activeCategory, allPosts])

  const latestPost = allPosts[0]

  return (
    <div className='claude-profile-home-timeline'>
      <div className='claude-home-feed'>
        <div className='claude-home-chips' role='group' aria-label='按分类筛选文章'>
          <button
            type='button'
            aria-pressed={!activeCategory}
            className={`claude-home-chip${!activeCategory ? ' is-active' : ''}`}
            onClick={() => setActiveCategory('')}>
            全部
          </button>
          {categoryOptions.map(category => (
            <button
              key={category.name}
              type='button'
              aria-pressed={activeCategory === category.name}
              className={`claude-home-chip${activeCategory === category.name ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category.name)}>
              {category.name}
            </button>
          ))}
        </div>

        {visiblePosts.length > 0 ? (
          <div className='claude-home-cards'>
            {visiblePosts.map(post => (
              <BlogItem key={post.id || post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className='claude-home-empty'>这一类还没有文章。换一个分类，或者去归档里翻更早的记录。</p>
        )}

        <div className='claude-home-more'>
          <SmartLink href='/archive'>更多归档</SmartLink>
        </div>
      </div>

      <aside id='year-list-container' className='claude-year-switcher' aria-label='站点近况'>
        <div className='claude-year-switcher-sticky'>
          <section className='claude-home-aside-card'>
            <h2 className='claude-home-aside-status'>做梦中 · 在写</h2>
            <p className='claude-home-aside-note'>
              在把站点从模板变成自己的房间。下一篇还没定标题。
            </p>
          </section>
          <nav className='claude-home-aside-card' aria-label='内容入口'>
            <ul className='claude-home-aside-links'>
              {HOME_LINKS.map(link => {
                const isActive =
                  router.asPath === link.href ||
                  router.asPath.startsWith(`${link.href}/`)
                return (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      className={`claude-home-aside-btn${isActive ? ' is-active' : ''}`}>
                      {link.label}
                    </SmartLink>
                  </li>
                )
              })}
            </ul>
          </nav>
          {latestPost && (
            <section className='claude-home-aside-card'>
              <SmartLink
                href={latestPost.href || `/${latestPost.slug}`}
                className='claude-home-aside-latest'>
                <h2 className='claude-home-aside-latest-title'>
                  {latestPost.title || '未命名'}
                </h2>
                <span className='claude-home-aside-latest-go'>阅读</span>
              </SmartLink>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}
