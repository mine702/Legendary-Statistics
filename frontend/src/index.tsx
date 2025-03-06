import {StrictMode, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'
import ScrollToTop from "./util/ScrollToTop.ts";
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {Login} from "./Login/Login.tsx";
import {requestURL} from "./config.ts";
import Cookies from "universal-cookie";
import axios from "axios";
import {Slide, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Main} from "./Main/Main.tsx";
import {checkIsAuthenticated} from "./util/loginManager.ts";
import {useLocalStorage} from "usehooks-ts";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorBoundaryFallbackRender} from "./component/ErrorBoundaryFallbackRender.tsx";
import {showToastOnErrorP2} from "./util/errorParser.ts";
import {AuthorizedByOAuth} from "./component/AuthorizedByOAuth.tsx";
import {EditorProvider} from "react-simple-wysiwyg";

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
  const [isLoaded,setLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode,_] = useLocalStorage("isDarkMode", false);
  const location = useLocation();
  const navigate = useNavigate();

  //다크모드 설정
  useEffect(() => {
    document.body.setAttribute("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const isAuthenticated = checkIsAuthenticated();
    if (location.pathname.startsWith("/login") && isAuthenticated){
      navigate("/main");
    }
    setLoaded(true);
  },[location.pathname])

  const onSocialAuthSuccess = showToastOnErrorP2(async (provider:string, code:string) => {
    await axios.post(`/auth/${provider}`, {code:code});
    navigate("/main");
  });

  if (!isLoaded) return null;
  return (
    <Routes>
      <Route path="/authorized/:provider" element={<AuthorizedByOAuth onSuccess={onSocialAuthSuccess} />}/>
      <Route path="/login/*" element={<Login/>}/>
      <Route path="/main/*" element={<Main/>}/>
      <Route path="*" element={<RedirectToCorrectPage/>}/>
    </Routes>
  )
}

const RedirectToCorrectPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/main");
  }, []);
  return <></>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={ErrorBoundaryFallbackRender}>
      <EditorProvider>
        <BrowserRouter>
          <ScrollToTop/>
          <App />
          <ToastContainer position="bottom-center" closeButton={false} hideProgressBar={true}
                          transition={Slide} autoClose={3000}/>
        </BrowserRouter>
      </EditorProvider>
    </ErrorBoundary>
  </StrictMode>,
)
