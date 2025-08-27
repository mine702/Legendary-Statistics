import style from "./TopBar.module.scss"

import {IconButton} from "../component/simple/IconButton.tsx";

import {useNavigate} from "react-router";
import Cookies from "universal-cookie";
import {useLocalStorage} from "usehooks-ts";

import topBarLogo from "../assets/img/top_bar_logo.png";
import darkModeIcon from "../assets/icons/dark_mode.svg";
import darkModeActiveIcon from "../assets/icons/dark_mode_active.svg";
import accountIcon from "../assets/icons/person.svg";
import logoutIcon from "../assets/icons/logout.svg";
import loginIcon from "../assets/icons/login.svg";
import {Space} from "../component/simple/Space.tsx";
import {checkIsAuthenticated} from "../util/loginManager.ts";
import {ToolTip} from "../component/tooltip/ToolTip.tsx";

export const TopBar = () => {
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = useLocalStorage("isDarkMode", true);

  const onClickLogout = () => {
    //로그아웃 요청
    const cookie = new Cookies();
    cookie.remove("accessToken", {path: "/"});
    cookie.remove("refreshToken", {path: "/"});
    window.location.reload();
  }

  const onClickLogin = () => {
    navigate('/login');
  }

  const onClickMyPage = () => {
    navigate('/my-page');
  }
  const onClickDarkMode = () => setDarkMode(!isDarkMode)

  let isAuthenticated = checkIsAuthenticated();

  return (
    <div className={style.root}>
      <div className={style.titleBtn} onClick={() => navigate('/')}>
        <img className={style.logo} src={topBarLogo as string} alt="logo"/>
      </div>
      <div style={{marginLeft: "30px"}}/>
      <Space/>
      <ToolTip tooltipContent="다크모드">
        <IconButton onClick={onClickDarkMode} active={isDarkMode}>
          <img src={isDarkMode ? darkModeActiveIcon as string : darkModeIcon as string} alt='darkMode'/>
        </IconButton>
      </ToolTip>
      <ToolTip tooltipContent="마이페이지">
        <IconButton onClick={onClickMyPage} style={{marginLeft: 5, marginRight: 3}}>
          <img
            src={accountIcon as string}
            alt='account'
            style={{width: 23, height: 23}}
          />
        </IconButton>
      </ToolTip>

      {isAuthenticated ? (
        <ToolTip tooltipContent="로그아웃">
          <IconButton onClick={onClickLogout}>
            <img src={logoutIcon as string} alt='logout'/>
          </IconButton>
        </ToolTip>
      ) : (
        <ToolTip tooltipContent="로그인">
          <IconButton onClick={onClickLogin}>
            <img src={loginIcon as string} alt='login'/>
          </IconButton>
        </ToolTip>
      )}
      <div className={style.rightArea}/>
    </div>
  )
}

