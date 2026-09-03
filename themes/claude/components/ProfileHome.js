import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'
import { BlogItem } from './BlogItem'

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

  return (
    <div className='claude-home-feed'>
      <div className='claude-home-chips' role='tablist' aria-label='文章分类'>
        <button
          type='button'
          role='tab'
          aria-selected={!activeCategory}
          className={`claude-home-chip${!activeCategory ? ' is-active' : ''}`}
          onClick={() => setActiveCategory('')}>
          全部
        </button>
        {categoryOptions.map(category => (
          <button
            key={category.name}
            type='button'
            role='tab'
            aria-selected={activeCategory === category.name}
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
        <p className='claude-home-empty'>这一类还没有文章。</p>
      )}

      <div className='claude-home-more'>
        <SmartLink href='/archive'>更多归档</SmartLink>
      </div>
    </div>
  )
}
