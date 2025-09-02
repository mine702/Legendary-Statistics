import {useEffect, useMemo, useState} from 'react'

type AdSize = '300x600' | '160x600'
type Placement = 'left' | 'right'

interface AdsenseSideProps {
  placement: Placement
  slotLarge: string   // 300x600용 슬롯 ID
  slotSmall: string   // 160x600용 슬롯 ID
  clientId?: string   // 기본값: ca-pub-3438793648335991
  breakpoint?: number // 기본값: 1600
  topOffset?: number  // sticky 상단 여백 기본값: 10
  className?: string  // 래퍼 클래스(선택)
}

const DEFAULT_CLIENT = 'ca-pub-3438793648335991'

export const AdsenseSide = ({
                              placement,
                              slotLarge,
                              slotSmall,
                              clientId = DEFAULT_CLIENT,
                              breakpoint = 1600,
                              topOffset = 100,
                              className,
                            }: AdsenseSideProps) => {
  const initialSize: AdSize =
    typeof window === 'undefined' ? '160x600' : (window.innerWidth >= breakpoint ? '300x600' : '160x600')

  const [size, setSize] = useState<AdSize>(initialSize)

  // 뷰포트 폭이 breakpoint를 넘나들 때만 사이즈 전환
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const onChange = (e: MediaQueryListEvent) => setSize(e.matches ? '300x600' : '160x600')
    mq.addEventListener?.('change', onChange)
    // @ts-ignore (구형 브라우저 대응)
    mq.addListener?.(onChange)
    return () => {
      mq.removeEventListener?.('change', onChange)
      // @ts-ignore
      mq.removeListener?.(onChange)
    }
  }, [breakpoint])

  const {w, h, slot} = useMemo(() => {
    const slot = size === '300x600' ? slotLarge : slotSmall
    const [w, h] = size.split('x').map(Number)
    return {w, h, slot}
  }, [size, slotLarge, slotSmall])

  // 슬롯/사이즈가 바뀔 때 광고 새로 요청 (ins 리마운트 + push)
  useEffect(() => {
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
  }, [slot, clientId])

  return (
    <div
      className={className ?? 'adSticky'}
      // sticky를 인라인으로도 보장 (SCSS에 .adSticky 있으면 그대로 써도 됨)
      style={{
        position: 'sticky',
        top: topOffset,
        height: h,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      data-placement={placement}
    >
      <ins
        key={`${placement}-${slot}`}   // 슬롯 바뀌면 리마운트
        className="adsbygoogle"
        style={{display: 'inline-block', width: w, height: h}}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-full-width-responsive="false"
      />
    </div>
  )
}
