import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export const BlogItem = props => {
  const { post } = props
  const { NOTION_CONFIG, siteInfo } = useGlobal()
  const showPageCover = siteConfig('CLAUDE_POST_COVER_ENABLE', true, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover

  return (
    <article className='claude-post-card'>
      {showPageCover && cover && (
        <SmartLink href={post.href} className='claude-post-card-cover'>
          <LazyImage
            src={cover}
            alt={post.title || ''}
            className='claude-post-card-cover-img'
          />
        </SmartLink>
      )}

      <div className='claude-post-card-body'>
        {post?.category && (
          <SmartLink
            href={`/category/${post.category}`}
            className='claude-post-card-category'>
            {post.category}
          </SmartLink>
        )}

        <h2 className='claude-post-card-title'>
          <SmartLink href={post.href}>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </SmartLink>
        </h2>

        <div className='claude-post-card-summary'>
          {!showPreview && post.summary}
          {showPreview && post?.blockMap && (
            <div className='line-clamp-2 overflow-hidden'>
              <NotionPage post={post} />
            </div>
          )}
        </div>

        <div className='claude-post-card-meta'>
          <span>{post.date?.start_date || post.publishDay || post.createdTime}</span>
          {post?.tags?.length > 0 &&
            post.tags.map(t => (
              <SmartLink key={t} href={`/tag/${t}`} className='claude-post-card-tag'>
                #{t}
              </SmartLink>
            ))}
        </div>
      </div>
    </article>
  )
}
