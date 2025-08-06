export interface GetRateRes {
  id: number;
  name: string;
}

export const getRateName = (rateId: number) => {
  switch (rateId) {
    case 1:
      return "희귀";
    case 2:
      return "서사";
    case 3:
      return "전설";
    case 4:
      return "신화";
    case 5:
      return "화폐";
    default:
      return "알 수 없음";
  }
}
