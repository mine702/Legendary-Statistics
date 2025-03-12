import axios from "axios";
import {requestURL} from "../config.ts";
import useSWR from "swr";
import {GetKindListRes} from "./dto/kind.ts";
import {ApiResponse} from "./dto/format.ts";
import {GetLegendListRes} from "./dto/legend.ts";

export const defaultFetchAxios = async <T>(url: string): Promise<T> => {
  const response = await axios.get<ApiResponse<T>>(requestURL + url);
  if (response.data.status !== "SUCCESS") throw new Error(response.data.message || "API 요청 실패");
  return response.data.data as T;
};

export const useSWRGetKindList = () => {
  return useSWR<GetKindListRes[]>(`/kind/list`, defaultFetchAxios);
}

export const useSWRGetLegendListByKind = (id: number) => {
  return useSWR<GetLegendListRes[]>(`/legend/list/${id}`, defaultFetchAxios);
}
