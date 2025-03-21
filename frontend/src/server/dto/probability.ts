export interface GetProbabilityGroupRes {
  id: number;
  name: string;
  probability: number;
  probabilityList: GetProbabilityRes[];
}

export interface GetProbabilityRes {
  id: number;
  name: string;
  probability: number;
}
