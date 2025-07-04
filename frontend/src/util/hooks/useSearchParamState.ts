import {useState} from "react";
import {SetURLSearchParams} from "react-router";

/**
 * useSearchParamState는 URLSearchParams를 이용하여 URL의 쿼리스트링을 상태로 관리하는 커스텀 훅입니다. <br/>
 * 이 훅을 사용하면 쿼리스트링이 상태로 관리됨으로서 setState가 발생할 때 마다 쿼리스트링이 변화하고, 네비게이션 히스토리가 갱신되어
 * 브라우저의 뒤로가기, 앞으로가기 버튼을 사용할 수 있습니다.
 */
export const useSearchParamState = <T>(searchParamList:[URLSearchParams, SetURLSearchParams]
                                       , paramName:string, initialState: T) => {
  const [urlSearchParams, setURLSearchParams] = searchParamList;

  const parseValue = (value: string | null, defaultValue: T): T => {
    if (value === null) return defaultValue;
    if (typeof defaultValue === "number") return Number(value) as T;
    if (typeof defaultValue === "boolean") return (value === "true") as T;
    return value as T;
  };

  const param = parseValue(urlSearchParams.get(paramName),initialState);
  const [state, setState] = useState<T>(param);
  
  const setParam = (value:T) => {
    setURLSearchParams((prev) => {
      prev.set(paramName, value.toString());
      return prev;
    }, {replace: true});
    setState(value);
  }
  
  return [state, setParam] as const;
}