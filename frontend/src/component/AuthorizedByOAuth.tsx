import style from "./AuthorizedByOAuth.module.scss"
import {useNavigate, useParams} from "react-router-dom";
import {Provider, useEffect, useRef} from "react";
import {showToastOnError} from "../util/errorParser.ts";
import axios from "axios";

interface Props {
  onSuccess:(provider:string, code:string)=>void;
}

export const AuthorizedByOAuth = (props:Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const url = new URL(window.location.href); // 브라우저 URL 사용
  const code = url.searchParams.get('code'); // 코드 쿼리
  const hasCalled = useRef(false);//strict모드에서 1회만 호출되도록 보장

  useEffect(() => {
    tryReceiveOAuthToken();
  }, []);

  const tryReceiveOAuthToken = showToastOnError(async () => {
    if (hasCalled.current) return;
    hasCalled.current = true;
    if (!code || !params.provider) {
      navigate("/");
      return;
    }
    props.onSuccess(params.provider, code);
  });

  return <></>;
}