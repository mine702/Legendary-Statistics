import style from "./TopBar.module.scss"

import {IconButton} from "../component/simple/IconButton.tsx";

import {useNavigate} from "react-router";
import Cookies from "universal-cookie";
import {useLocalStorage} from "usehooks-ts";

import topBarLogo from "../assets/img/top_bar_logo.png";
import darkModeIcon from "../assets/icons/dark_mode.svg";
import darkModeActiveIcon from "../assets/icons/dark_mode_active.svg";
import settingsIcon from "../assets/icons/settings.svg";
import logoutIcon from "../assets/icons/logout.svg";
import loginIcon from "../assets/icons/login.svg";
import {Space} from "../component/simple/Space.tsx";
import {checkIsAuthenticated} from "../util/loginManager.ts";

export const TopBar = () => {
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = useLocalStorage("isDarkMode", false);

  const onClickLogout = () => {
    //로그아웃 요청
    const cookie = new Cookies();
    cookie.remove("accessToken", {path: "/"});
    cookie.remove("refreshToken", {path: "/"});
    window.location.reload();
  }

  const onClickLogin = () => {
    //로그인 페이지로 이동
    navigate('/login');
  }

  const onClickDarkMode = () => setDarkMode(!isDarkMode)

  let isAuthenticated = checkIsAuthenticated();

  return (
    <div className={style.root}>
      <div className={style.titleBtn} onClick={() => navigate('/home')}>
        <img className={style.logo} src={topBarLogo as string} alt="wiztim"/>
      </div>
      <div style={{marginLeft: "30px"}}/>
      <Space/>
      <IconButton onClick={onClickDarkMode} active={isDarkMode}>
        <img src={isDarkMode ? darkModeActiveIcon as string : darkModeIcon as string} alt='darkMode'/>
      </IconButton>
      <IconButton onClick={() => {
      }} style={{marginLeft: 5, marginRight: 0}}>
        <img src={settingsIcon as string} alt='settings'/>
      </IconButton>
      {isAuthenticated ? (
        <IconButton onClick={onClickLogout}>
          <img src={logoutIcon as string} alt='logout'/>
        </IconButton>
      ) : (
        <IconButton onClick={onClickLogin}>
          <img src={loginIcon as string} alt='login'/>
        </IconButton>
      )}
      <div style={{marginRight: '30px'}}/>
    </div>
  )
}

