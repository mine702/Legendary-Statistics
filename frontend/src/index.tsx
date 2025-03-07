import {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import ScrollToTop from "./util/ScrollToTop.ts";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
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

  //다크모드 설정
  useEffect(() => {
    document.body.setAttribute("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const onSocialAuthSuccess = showToastOnErrorP2(async (provider: string, code: string) => {
    await axios.post(`/auth/${provider}`, {code: code});
    navigate("/main");
  });

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
