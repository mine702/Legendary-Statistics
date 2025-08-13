import {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import ScrollToTop from "./util/ScrollToTop.ts";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router";
import {requestURL} from "./config.ts";
import Cookies from "universal-cookie";
import axios from "axios";
import {Slide, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useLocalStorage} from "usehooks-ts";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorBoundaryFallbackRender} from "./component/ErrorBoundaryFallbackRender.tsx";
import {showToastOnErrorP2} from "./util/errorParser.ts";
import {AuthorizedByOAuth} from "./component/AuthorizedByOAuth.tsx";
import {EditorProvider} from "react-simple-wysiwyg";
import {Main} from "./Main/Main.tsx";
import {checkIsAuthenticated} from "./util/loginManager.ts";
import {useMobileViewport} from "./util/hooks/useMobileViewport.ts";

//axios 설정
axios.defaults.withCredentials = true;
axios.defaults.baseURL = requestURL;
axios.interceptors.response.use(
  res => res,
  async error => {
    if (error.response === undefined) return Promise.reject(error);
    const status = error.response.status;
    if (status === 401) {
      //401을 받은 경우 갱신 실패임. 쿠키 삭제 후 새로고침
      const cookie = new Cookies();
      cookie.remove("accessToken", {path: "/"});
      cookie.remove("refreshToken", {path: "/"});
      window.location.reload();
    }
    return Promise.reject(error);
  }
)

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode, _] = useLocalStorage("isDarkMode", false);
  const navigate = useNavigate();
  useMobileViewport();
  //다크모드 설정
  useEffect(() => {
    document.body.setAttribute("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const onSocialAuthSuccess = showToastOnErrorP2(async (provider: string, code: string) => {
    await axios.post(`/auth/${provider}`, {code: code});
    navigate("/main");
  });

  useEffect(() => {
    //로그인페이지로 이동하려고 시도할 때, 로그인이 되어있으면 메인페이지로 리다이렉트
    let isAuthenticated = checkIsAuthenticated();
    const isFindPasswordPage = location.pathname.startsWith("/login/find-password");
    if (location.pathname.startsWith("/login") && isAuthenticated && !isFindPasswordPage) {
      navigate("/home");
    }
  }, [location.pathname])

  // 라우트 변경 시
  useEffect(() => {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/authorized/:provider" element={<AuthorizedByOAuth onSuccess={onSocialAuthSuccess}/>}/>
      <Route path="*" element={<Main/>}/>
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={ErrorBoundaryFallbackRender}>
      <EditorProvider>
        <BrowserRouter>
          <ScrollToTop/>
          <App/>
          <ToastContainer position="bottom-center" closeButton={false} hideProgressBar={true}
                          transition={Slide} autoClose={3000}/>
        </BrowserRouter>
      </EditorProvider>
    </ErrorBoundary>
  </StrictMode>,
)
