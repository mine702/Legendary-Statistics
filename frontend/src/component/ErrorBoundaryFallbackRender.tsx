import style from "./ErrorBoundaryFallbackRender.module.scss"

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorBoundaryFallbackRender = (props:Props) => {
  return (
    <div className={style.root}>
      <div className={style.title}>오류가 발생했습니다.</div>
      <div className={style.subtitle}>이 페이지를 발견했다면 개발자에게 알려주세요. 이 페이지는 테스트서버에서만 표시됩니다.</div>
      <div className={style.message}>{props.error.message}</div>
      <div className={style.stack}>{props.error.stack}</div>
      <button className={style.button} onClick={props.resetErrorBoundary}>다시 시도</button>
    </div>
  )
}
