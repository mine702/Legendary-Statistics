/** 특정 항목의 시간이 현재 시점을 기준으로 24시간 이상 지났는지를 확인합니다. */
export const isNew = (timestampStr: string | undefined | null): boolean => {
  if (!timestampStr) return false;

  const inquiryTime = new Date(timestampStr); // "2025-04-03T10:24:59"
  const now = new Date();

  const diff = now.getTime() - inquiryTime.getTime(); // 밀리초 차이
  const diffInHours = diff / (1000 * 60 * 60);

  return diffInHours <= 24;
}

