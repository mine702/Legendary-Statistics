// src/components/KakaoSideAds.tsx
import KakaoAd from "./KakaoAd";

type SideProps = {
  leftUnit: string;   // 왼쪽 광고단위 ID
  rightUnit: string;  // 오른쪽 광고단위 ID
  top?: number;       // 상단 오프셋(px) - 헤더 높이만큼
  width?: number;     // 보통 160
  height?: number;    // 보통 600
  enabled?: boolean;  // 라우트/콘텐츠 준비 등 정책가드
  test?: boolean;     // 테스트 모드
};

export default function KakaoSideAds({
                                       leftUnit,
                                       rightUnit,
                                       top = 120,
                                       width = 160,
                                       height = 600,
                                       enabled = true,
                                       test = false,
                                     }: SideProps) {
  if (!enabled) return null;
  return (
    <>
      <div className="side-ad left" style={{top}}>
        <KakaoAd unit={leftUnit} width={width} height={height} test={test}/>
      </div>
      <div className="side-ad right" style={{top}}>
        <KakaoAd unit={rightUnit} width={width} height={height} test={test}/>
      </div>
    </>
  );
}
