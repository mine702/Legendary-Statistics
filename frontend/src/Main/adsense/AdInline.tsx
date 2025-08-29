import {useEffect, useRef} from "react";
import {adClient} from "../../config.ts";

type Props = {
  reloadKey?: string | number;
};

export const AdInline = (props: Props) => {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    // 이미 초기화된 슬롯이면 재호출 방지
    const inited = el.getAttribute("data-adsbygoogle-status");
    if (inited) return;

    // 폭이 0이면 push를 지연
    const pushWhenReady = () => {
      const width = el.offsetWidth || el.clientWidth || 0;
      const visible = el.offsetParent !== null; // display:none 부모 방지

      if (width > 0 && visible) {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch {
        }
        return true;
      }
      return false;
    };

    // 1) 즉시 시도
    if (pushWhenReady()) return;

    // 2) ResizeObserver로 폭이 생길 때까지 대기
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        if (pushWhenReady() && ro) {
          ro.disconnect();
          ro = null;
        }
      });
      ro.observe(el);
    }

    // 3) 폴백: rAF + 타임아웃 재시도
    let raf = 0;
    let tries = 0;
    const tick = () => {
      if (pushWhenReady() || tries > 30) return; // 최대 ~0.5s
      tries += 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [props.reloadKey]);

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{display: "block"}}
      data-ad-client={adClient}
      data-ad-slot="4654118695"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};
