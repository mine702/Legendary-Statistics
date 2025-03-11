import axios from "axios";
import {requestURL} from "../config.ts";
import useSWR from "swr";

const defaultFetchAxios =
  async <T>(url: string) => axios.get<T>(requestURL + url).then(value => value.data)

export const useSWRGetList = () => {
  return useSWR(``, defaultFetchAxios);
}
