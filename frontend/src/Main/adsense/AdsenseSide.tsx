import {useEffect} from 'react'

export const AdsenseSide = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle
        adsbygoogle.push({})
      } catch (e) {
        console.error(e)
      }
    }
    let interval = setInterval(() => {
      // @ts-ignore
      if (window.adsbygoogle) {
        pushAd()
        clearInterval(interval)
      }
    }, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <ins
      className='adsbygoogle'
      style={{display: 'inline-block', width: '300px', height: '600px'}}
      data-ad-client='ca-pub-3438793648335991'
      data-ad-slot='6054446808'
    ></ins>
  )
}
