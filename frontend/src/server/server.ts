import axios from "axios";
import {requestURL} from "../config.ts";
import useSWR from "swr";
import {GetKindRes} from "./dto/kind.ts";
import {ApiResponse} from "./dto/format.ts";
import {GetLegendListRes} from "./dto/legend.ts";
import {GetTreasureRes} from "./dto/treasure.ts";
import {GetProbabilityGroupRes} from "./dto/probability.ts";
import {GetRateRes} from "./dto/rate.ts";
import {GetBoardCategoryRes, GetBoardCommentRes, GetBoardListRes, GetBoardRes} from "./dto/board.ts";
import {PagedContent} from "./pager.ts";
import {GetRankingRes} from "./dto/ranking.ts";
import {GetNewLegendCommentRes, GetNewLegendListRes, GetNewLegendRes} from "./dto/newLegend.ts";
import {GetMyInfoRes} from "./dto/user.ts";
import {GetRerollProbabilityRes, GetSeasonRes} from "./dto/reroll.ts";

export const defaultFetchAxios = async <T>(url: string): Promise<T> => {
  const response = await axios.get<ApiResponse<T>>(requestURL + url);
  if (response.data.status !== "SUCCESS") throw new Error(response.data.message || "API 요청 실패");
  return response.data.data as T;
};

// 전설이 종류리스트 불러오기
export const useSWRGetKindList = () => {
  return useSWR<GetKindRes[]>(`/kind/list`, defaultFetchAxios);
}

// 전설이 종류를 이용해서 전설이 불러오기
export const useSWRGetLegendListByKind = (id: number) => {
  return useSWR<GetLegendListRes[]>(`/legend/list/${id}`, defaultFetchAxios);
}

// 보물왕국 리스트 불러오기
export const useSWRGetTreasureList = () => {
  return useSWR<GetTreasureRes[]>(`/treasure/list`, defaultFetchAxios);
}

// 보물왕국 리스트 불러오기
export const useSWRGetTreasureLastList = () => {
  return useSWR<GetTreasureRes[]>(`/treasure/last`, defaultFetchAxios);
}

// 보물왕국 상세정보 불러오기
export const useSWRGetTreasureDetail = (id: string | undefined) => {
  return useSWR<GetTreasureRes>(`/treasure/detail/${id}`, defaultFetchAxios);
}

// 보물왕국 id 로 확률 정보 불러오기
export const useSWRGetProbabilityByTreasureId = (id: string | undefined) => {
  return useSWR<GetProbabilityGroupRes[]>(`/treasure/probability/${id}`, defaultFetchAxios);
}

// 등급 가져오기
export const useSWRGetRateList = () => {
  return useSWR<GetRateRes[]>(`/rate/list`, defaultFetchAxios);
}

// 내 보드 리스트 불러오기
export const useSWRBoardList = (page: number, category: string, keyword?: string) => {
  const params = new URLSearchParams();
  params.set('category', category);
  params.set('page', String(page));
  params.set('size', '10');

  if (keyword) params.set('keyword', keyword);

  return useSWR<PagedContent<GetBoardListRes>>(`/board/list?${params.toString()}`, defaultFetchAxios);
};

export const useSWRGetMyBoardList = (page: number, keyword?: string) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', '10');
  if (keyword) params.set('keyword', keyword);
  return useSWR<PagedContent<GetBoardListRes>>(`/board/my-list?${params.toString()}`, defaultFetchAxios);
}

export const useSWRGetLastTimeBoard = () => {
  return useSWR<{ [index: string]: string }>(`/board/last-time-inquiry`, defaultFetchAxios)
}

export const useSWRBoardCategories = () => {
  return useSWR<GetBoardCategoryRes[]>(`/board/categories`, defaultFetchAxios);
}

export const useSWRGetBoardDetail = (id: number) => {
  return useSWR<GetBoardRes>(`/board/detail/${id}`, defaultFetchAxios);
}

export const useSWRGetBoardCommentList = (boardId: number) => {
  return useSWR<GetBoardCommentRes[]>(`/board/comment/${boardId}`, defaultFetchAxios)
}

export const useSWRRankingList = (page: number, size: number, kind?: number, limit?: boolean, rate?: number | undefined, year?: number | undefined, keyword?: string | undefined) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));

  if (kind) params.set('kind', String(kind));
  if (limit) params.set('limit', String(limit));
  if (rate) params.set('rate', String(rate));
  if (year) params.set('year', String(year));
  if (keyword) params.set('keyword', keyword);

  return useSWR<PagedContent<GetRankingRes>>(`/ranking/list?${params.toString()}`, defaultFetchAxios);
};

export const useSWRGetNewLegendList = () => {
  return useSWR<GetNewLegendListRes[]>(`/new-legend/list`, defaultFetchAxios);
}

export const useSWRGetNewLegendDetail = (id: number | null) => {
  return useSWR<GetNewLegendRes>(id ? `/new-legend/detail/${id}` : null, defaultFetchAxios);
}

export const useSWRGetNewLegendCommentList = (id: number | null) => {
  return useSWR<GetNewLegendCommentRes[]>(id ? `/new-legend/comment/${id}` : null, defaultFetchAxios)
}

export const useSWRGetNewLegendLast = () => {
  return useSWR<GetNewLegendRes>(`/new-legend/last`, defaultFetchAxios);
}

export const useSWRGetLegendLast = () => {
  return useSWR<GetLegendListRes[]>(`/legend/last`, defaultFetchAxios);
}

export const useSWRMyInfo = () => {
  return useSWR<GetMyInfoRes>("/user/my-info", defaultFetchAxios)
}

export const useSWRGetSeasons = () => {
  return useSWR<GetSeasonRes[]>(`/reroll/seasons`, defaultFetchAxios);
}

export const useSWRGetRerollProbability = (seasonId: number, userLevel: number) => {
  return useSWR<GetRerollProbabilityRes>(`/reroll/probability/${seasonId}/${userLevel}`, defaultFetchAxios);
}
