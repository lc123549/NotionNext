import { useState } from 'react'
import Catalog from './Catalog'

/**
 * 移动端悬浮目录，文章页左栏在窄屏收起来后用它打开。
 */
export default function FloatTocButton({ post, lock }) {
  const [tocVisible, setTocVisible] = useState(false)

  if (!post || lock || !post.toc || post.toc.length < 1) {
    return null
  }

  return (
    <div className='fixed xl:hidden right-4 bottom-24 z-30'>
      <button
        type='button'
        aria-label='目录'
        onClick={() => setTocVisible(visible => !visible)}
        className='w-11 h-11 select-none hover:scale-110 transform duration-200 text-black dark:text-gray-200 rounded-full bg-white drop-shadow-lg flex justify-center items-center dark:bg-[#18171d]'>
        <i className='fa-list-ol fas' />
      </button>

      <div
        className={`${
          tocVisible ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-2'
        } duration-200 fixed right-4 bottom-40 w-64 rounded-xl py-2 px-2 bg-white dark:bg-[#18171d] border border-[#4f46e5] shadow-lg`}>
        <Catalog post={post} scrollMode='window' />
      </div>

      <div
        className={`${tocVisible ? 'block' : 'hidden'} fixed inset-0 z-[-1]`}
        onClick={() => setTocVisible(false)}
      />
    </div>
  )
}
