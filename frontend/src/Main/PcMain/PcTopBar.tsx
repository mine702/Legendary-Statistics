import style from "./PcTopBar.module.scss"

import {IconButton} from "../../component/simple/IconButton.tsx";

import {Location, useLocation, useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
import {ToolTip} from "../../component/tooltip/ToolTip.tsx";
import {useLocalStorage} from "usehooks-ts";
import React from "react";

import topBarLogo from "../../assets/img/top_bar_logo.png";
import darkModeIcon from "../../assets/icons/dark_mode.svg";
import darkModeActiveIcon from "../../assets/icons/dark_mode_active.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import menuIcon from "../../assets/icons/menu.svg";
import {Space} from "../../component/simple/Space.tsx";

export const PcTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setDarkMode] = useLocalStorage("isDarkMode", false);
  const [showSideMenu, setShowSideMenu] = useLocalStorage("showSideMenu", true);

  const onClickLogout = () => {
    //로그아웃 요청
    let cookie = new Cookies();
    cookie.remove("accessToken", {path: "/"});
    cookie.remove("refreshToken", {path: "/"});
    window.location.reload();
  }

  const onClickDarkMode = () => setDarkMode(!isDarkMode)

  return (
    <div className={style.root}>
      <IconButton onClick={() => setShowSideMenu(!showSideMenu)} style={{marginLeft: 15, marginRight: 10}}>
        <img className={style.icon} src={menuIcon as string} alt='sidemenu'/>
      </IconButton>
      <div className={style.titleBtn} onClick={() => navigate('/main')}>
        <img className={style.logo} src={topBarLogo as string} alt="wiztim"/>
      </div>
      <div style={{marginLeft: "30px"}}/>
      <Space/>
      <ToolTip tooltipContent="설정">
        <IconButton onClick={() => {
        }}>
          <img src={settingsIcon as string} alt='settings'/>
        </IconButton>
      </ToolTip>
      <ToolTip tooltipContent="다크모드">
        <IconButton onClick={onClickDarkMode} active={isDarkMode}>
          <img src={isDarkMode ? darkModeActiveIcon as string : darkModeIcon as string} alt='darkMode'/>
        </IconButton>
      </ToolTip>
      <ToolTip tooltipContent="로그아웃">
        <IconButton onClick={onClickLogout}>
          <img src={logoutIcon as string} alt='logout'/>
        </IconButton>
      </ToolTip>
      <div style={{marginRight: '30px'}}/>
    </div>
  )
}

interface LinkButtonProps {
  to: string,
  children: React.ReactNode
  navigate: (to: string) => void
  location: Location<never>
}

export const LinkButton = (props: LinkButtonProps) => {
  const isActive = props.location.pathname.includes(props.to);
  return (
    <button className={`${style.menuBtn} ${isActive ? style.selected : ""}`}
            onClick={() => props.navigate(props.to)}>
      {props.children}
    </button>
  )
}

