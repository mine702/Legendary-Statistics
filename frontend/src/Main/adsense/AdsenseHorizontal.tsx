import {Adsense} from '@ctrl/react-adsense';
import {useEffect, useRef, useState} from 'react';
import style from './AdsenseHorizontal.module.scss';

export const AdsenseHorizontal = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let lastW = 0;
    const measure = () => Math.floor(el.getBoundingClientRect().width || 0);

    const updateIfChanged = () => {
      const w = measure();
      if (Math.abs(w - lastW) >= 40) {
        lastW = w;
        setKey(k => k + 1);
      }
    };

    lastW = measure();

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => updateIfChanged());
      ro.observe(el);
    } else {
      let t: any;
      const on = () => {
        clearTimeout(t);
        t = setTimeout(updateIfChanged, 200);
      };
      // @ts-ignore
      window.addEventListener('resize', on);
      return () => window.removeEventListener('resize', on);
    }
    return () => ro?.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={style.adWrap}>
      <Adsense
        key={key}
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
