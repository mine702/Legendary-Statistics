// src/component/ads/AdSlot.tsx
import {useEffect, useRef} from "react";

type Props = {
  client: string;      // ca-pub-xxxxxxxx
  slot: string;        // 애드센스 data-ad-slot ID
  format?: "auto" | "vertical" | "horizontal" | "rectangle";
  fullWidth?: boolean; // 반응형 여부
  style?: React.CSSProperties;
  className?: string;
  /** 라우트 변경 시 리로드를 원할 때 key로 pathname 등을 넘겨주세요 */
  reloadKey?: string;
};

export const AdSlot = ({
                         client,
                         slot,
                         format = "auto",
                         fullWidth = true,
                         style,
                         className,
                         reloadKey
                       }: Props) => {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // 이미 index.html의 head에 adsense 스크립트가 있다고 가정
    try {
      // 기존 내용 초기화 (재마운트/경로 변경 시 안전)
      if (insRef.current) insRef.current.innerHTML = "";
      // 광고 요청
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // console.warn("adsbygoogle push error", e);
    }
  }, [reloadKey]);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className ?? ""}`}
      style={{display: "block", ...(style || {})}}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidth ? "true" : "false"}
    />
  );
}
