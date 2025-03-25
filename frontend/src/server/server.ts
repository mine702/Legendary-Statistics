import axios from "axios";
import {requestURL} from "../config.ts";
import useSWR from "swr";
import {GetKindRes} from "./dto/kind.ts";
import {ApiResponse} from "./dto/format.ts";
import {GetLegendListRes} from "./dto/legend.ts";
import {GetTreasureRes} from "./dto/treasure.ts";
import {GetProbabilityGroupRes} from "./dto/probability.ts";
import {GetRateRes} from "./dto/rate.ts";

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
