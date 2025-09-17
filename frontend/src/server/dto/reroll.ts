export interface GetRerollProbabilityRes {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

export interface GetSeasonRes {
  id: number;
  seasonNo: number;
  startAt: string;
  endAt: string;
}
