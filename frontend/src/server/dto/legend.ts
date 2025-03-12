export interface GetLegendListRes {
  kindId: number;
  kindName: string;
  rateId: number
  name: string;
  limited: boolean;
  animation: boolean;
  legends: GetLegendRes[];
}

export interface GetLegendRes {
  id: number;
  actualFileName: string;
  path: string;
  star: number;
  createdAt: string;
  isDeleted: boolean;
}
