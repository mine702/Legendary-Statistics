import {useEffect, useMemo, useState} from 'react'

type Placement = 'left' | 'right'

interface AdsenseSideProps {
  placement: Placement
  slot: string                 // 단일 슬롯만 사용
  clientId?: string
  className?: string
  minViewportHeight?: number   // 세로 높이 조건(기존 유지)
  minWidthToShow?: number      // 가로폭 조건: 기본 780px 이상에서만 노출
}

const DEFAULT_CLIENT = 'ca-pub-3438793648335991'

export const AdsenseSide = ({
                              placement,
                              slot,
                              clientId = DEFAULT_CLIENT,
                              className,
                              minViewportHeight = 700,
                              minWidthToShow = 780,
                            }: AdsenseSideProps) => {
  const [vw, setVw] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 0))
  const [vh, setVh] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 0))

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  // 160x600 고정
  const {w, h} = useMemo(() => ({w: 160, h: 600}), [])

  // 가로폭(vw) ≥ 780 && 세로(vh) > 700 에서만 노출
  const canShow = vw >= minWidthToShow && vh > minViewportHeight

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

  if (!canShow) return null

  return (
    <div
      className={className ?? 'adSticky'}
      style={{
        position: 'fixed',
        bottom: 5,
        height: h,
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
