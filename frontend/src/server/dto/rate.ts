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

export const getRateColor = (rateId: number): string => {
  switch (rateId) {
    case 1:
      return "#4caf50";
    case 2:
      return "#2196f3";
    case 3:
      return "#9c27b0";
    case 4:
      return "#ffb300";
    case 5:
      return "#9e9e9e";
    default:
      return "#e85353";
  }
};

