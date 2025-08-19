// src/components/KakaoAd.tsx
import {useEffect, useRef} from "react";

type Props = {
  unit: string;                  // 광고단위 ID
  width: number | string;        // 160
  height: number | string;       // 600
  enabled?: boolean;             // 콘텐츠 준비/라우트 허용 여부
  test?: boolean;                // 스테이징에서 테스트모드 on
  style?: React.CSSProperties;
  className?: string;
};

export default function KakaoAd({
                                  unit, width, height, enabled = true, test = false, style, className,
                                }: Props) {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
  }, [enabled, unit]);

  if (!enabled) return null;

  return (
    <ins
      className={`kakao_ad_area ${className || ""}`}
      style={{display: "none", ...style}}
      data-ad-unit={unit}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
      {...(test ? {"data-ad-test": "on"} : {})}
      ref={(el) => (ref.current = el)}
    />
  );
}
