import {useEffect, useMemo, useState} from 'react'

type AdSize = '300x600' | '160x600'
type Placement = 'left' | 'right'

interface AdsenseSideProps {
  placement: Placement
  slotLarge: string
  slotSmall: string
  clientId?: string
  breakpoint?: number
  className?: string
  minViewportHeight?: number
}

const DEFAULT_CLIENT = 'ca-pub-3438793648335991'

export const AdsenseSide = ({
                              placement,
                              slotLarge,
                              slotSmall,
                              clientId = DEFAULT_CLIENT,
                              breakpoint = 1600,
                              className,
                              minViewportHeight = 700,
                            }: AdsenseSideProps) => {
  const initialSize: AdSize =
    typeof window === 'undefined' ? '160x600' : (window.innerWidth >= breakpoint ? '300x600' : '160x600')

  const [size, setSize] = useState<AdSize>(initialSize)
  const [vh, setVh] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 0))

  // 브레이크포인트 변경 감지
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const onChange = (e: MediaQueryListEvent) => setSize(e.matches ? '300x600' : '160x600')
    mq.addEventListener?.('change', onChange)
    // @ts-ignore (구형 브라우저)
    mq.addListener?.(onChange)
    return () => {
      mq.removeEventListener?.('change', onChange)
      // @ts-ignore
      mq.removeListener?.(onChange)
    }
  }, [breakpoint])

  // 뷰포트 높이 감시
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const {w, h, slot} = useMemo(() => {
    const slot = size === '300x600' ? slotLarge : slotSmall
    const [w, h] = size.split('x').map(Number)
    return {w, h, slot}
  }, [size, slotLarge, slotSmall])

  // 뷰포트 높이가 기준을 넘을 때만 광고 요청
  const canShow = vh > minViewportHeight

  useEffect(() => {
    if (!canShow) return
    const pushAd = () => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error(e)
      }
    }
    const t = setInterval(() => {
      // @ts-ignore
      if (window.adsbygoogle) {
        pushAd()
        clearInterval(t)
      }
    }, 100)
    return () => clearInterval(t)
  }, [slot, clientId, canShow])

  // 기준 이하면 아무것도 렌더하지 않음(요청 자체를 안 함)
  if (!canShow) return null

  return (
    <div
      className={className ?? 'adSticky'}
      style={{
        position: 'fixed',
        bottom: 10,
        height: h,
        border: '1px solid #ccc',
      }}
      data-placement={placement}
      data-vh={vh}
    >
      <ins
        key={`${placement}-${slot}`}
        className="adsbygoogle"
        style={{display: 'inline-block', width: w, height: h}}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-full-width-responsive="false"
      />
    </div>
  )
}
