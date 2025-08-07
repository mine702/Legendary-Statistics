export interface GetNewLegendListRes {
  id: number;
  name: string;
  rateId: number;
}

export interface GetNewLegendRes {
  id: number;
  name: string;
  rateId: number;
  price: number;
  videoUrl: string;
  good: number;
  bad: number;
  createdAt: string;
}

export interface GetNewLegendCommentRes {
  id: number;
  userId: number;
  userName: number;
  content: string;
  createdAt: string;
}
