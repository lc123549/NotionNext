import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

const VARIANTS = ['dunes', 'scoop', 'fade', 'silk']

/**
 * 头图底边过渡。默认 dunes（旧蓝浪）；?edge=scoop|fade|silk 可预览替代。
 */
export default function WavesArea({ variant }) {
  const { isDarkMode } = useGlobal()
  const router = useRouter()
  const color = isDarkMode ? '#18171d' : '#f7f9fe'
  const queryEdge = typeof router.query.edge === 'string' ? router.query.edge : ''
  const edge = VARIANTS.includes(variant)
    ? variant
    : VARIANTS.includes(queryEdge)
      ? queryEdge
      : 'dunes'

  if (edge === 'scoop') {
    return (
      <section className='w-full absolute left-0 bottom-0 z-10 pointer-events-none h-20 overflow-hidden'>
        <svg
          className='w-full h-full'
          viewBox='0 0 1440 80'
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path fill={color} d='M0,48 C240,88 480,8 720,40 C960,72 1200,16 1440,48 L1440,80 L0,80 Z' />
        </svg>
      </section>
    )
  }

  if (edge === 'fade') {
    return (
      <section
        className='w-full absolute left-0 bottom-0 z-10 pointer-events-none h-28'
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${color} 92%)`
        }}
      />
    )
  }

  if (edge === 'silk') {
    return (
      <section className='claude-hero-silk w-full absolute left-0 bottom-0 z-10 pointer-events-none h-[72px] overflow-hidden'>
        <svg
          className='w-[200%] h-full claude-hero-silk-svg'
          viewBox='0 0 1440 72'
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            fill={color}
            d='M0,40 C180,62 320,18 480,36 C640,54 800,14 960,38 C1120,62 1280,22 1440,40 L1440,72 L0,72 Z'
          />
        </svg>
        <style jsx>{`
          .claude-hero-silk-svg {
            animation: claude-silk-shift 18s ease-in-out infinite alternate;
          }
          @keyframes claude-silk-shift {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .claude-hero-silk-svg {
              animation: none;
            }
          }
        `}</style>
      </section>
    )
  }

  return (
    <section className='main-hero-waves-area waves-area w-full absolute left-0 z-10 bottom-0'>
      <svg
        className='waves-svg w-full h-[60px]'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        viewBox='0 24 150 28'
        preserveAspectRatio='none'
        shapeRendering='auto'>
        <defs>
          <path
            id='gentle-wave'
            d='M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z'
          />
        </defs>
        <g className='parallax'>
          <use href='#gentle-wave' xlinkHref='#gentle-wave' x='48' y='0' />
          <use href='#gentle-wave' xlinkHref='#gentle-wave' x='48' y='3' />
          <use href='#gentle-wave' xlinkHref='#gentle-wave' x='48' y='5' />
          <use href='#gentle-wave' xlinkHref='#gentle-wave' x='48' y='7' />
        </g>
      </svg>
      <style jsx global>
        {`
          .parallax > use {
            animation: move-forever 30s cubic-bezier(0.55, 0.5, 0.45, 0.5)
              infinite;
          }
          .parallax > use:nth-child(1) {
            animation-delay: -2s;
            animation-duration: 7s;
            fill: ${color};
            opacity: 0.5;
          }
          .parallax > use:nth-child(2) {
            animation-delay: -3s;
            animation-duration: 10s;
            fill: ${color};
            opacity: 0.6;
          }
          .parallax > use:nth-child(3) {
            animation-delay: -4s;
            animation-duration: 13s;
            fill: ${color};
            opacity: 0.7;
          }
          .parallax > use:nth-child(4) {
            animation-delay: -5s;
            animation-duration: 20s;
            fill: ${color};
          }

          @keyframes move-forever {
            0% {
              transform: translate3d(-90px, 0, 0);
            }
            100% {
              transform: translate3d(85px, 0, 0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .parallax > use {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  )
}
