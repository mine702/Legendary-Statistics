export interface GetRerollProbabilityRes {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    level6: number;
}

export interface GetSeasonRes {
    id: number;
    seasonNo: number;
    startAt: string;
    endAt: string;
}

export interface GetChampionRes {
    id: number;
    cost: number;
    name: string;
    path: string;
    mobilePath: string;
    synergyList: number[];
}

export interface GetSynergyRes {
    id: number;
    name: string;
    desc: string;
}