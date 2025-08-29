import {Adsense} from '@ctrl/react-adsense';
import {useEffect, useRef, useState} from 'react';
import style from './AdsenseHorizontal.module.scss';

function pickBucket(w: number) {
  // 구글 디스플레이 반응형에서 흔한 사이즈 구간
  if (w >= 970) return '970x250';
  if (w >= 728) return '728x90';
  if (w >= 468) return '468x60';
  if (w >= 336) return '336x280';
  if (w >= 320) return '320x100';
  return 'too-narrow';
}

export const AdsenseHorizontal = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [bucket, setBucket] = useState<string>('init');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width || 0);
      setBucket(pickBucket(w));
    };

    measure(); // 초기 1회

    // ResizeObserver로 컨테이너 폭 변화 감지
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      // 폴백
      const on = () => requestAnimationFrame(measure);
      // @ts-ignore
      window.addEventListener('resize', on);
      return () => window.removeEventListener('resize', on);
    }
    return () => ro?.disconnect();
  }, []);

  // 너무 좁으면 자리만 예약(광고 요청 X)
  if (bucket === 'too-narrow') {
    return (
      <div ref={wrapRef} className={style.adWrap}>
        <div className={style.placeholder}/>
      </div>
    );
  }

  // key=bucket → 구간 바뀔 때마다 완전 리마운트(새 폭으로 재로딩)
  return (
    <div ref={wrapRef} className={style.adWrap}>
      <Adsense
        key={bucket}
        className={style.horizontal}
        client="ca-pub-3438793648335991"
        slot="4654118695"
        format="auto"
        responsive="true"
        style={{display: 'block', width: '100%'}}
      />
    </div>
  );
};
