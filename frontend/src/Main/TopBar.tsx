import style from "./TopBar.module.scss"

import {IconButton} from "../component/simple/IconButton.tsx";

import {Location, useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
import {ToolTip} from "../component/tooltip/ToolTip.tsx";
import {useLocalStorage} from "usehooks-ts";
import React from "react";

import topBarLogo from "../assets/img/top_bar_logo.png";
import darkModeIcon from "../assets/icons/dark_mode.svg";
import darkModeActiveIcon from "../assets/icons/dark_mode_active.svg";
import settingsIcon from "../assets/icons/settings.svg";
import logoutIcon from "../assets/icons/logout.svg";
import {Space} from "../component/simple/Space.tsx";

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

  const onClickDarkMode = () => setDarkMode(!isDarkMode)

  return (
    <div className={style.root}>
      <div className={style.titleBtn} onClick={() => navigate('/home')}>
        <img className={style.logo} src={topBarLogo as string} alt="wiztim"/>
      </div>
      <div style={{marginLeft: "30px"}}/>
      <Space/>
      <ToolTip tooltipContent="다크모드">
        <IconButton onClick={onClickDarkMode} active={isDarkMode}>
          <img src={isDarkMode ? darkModeActiveIcon as string : darkModeIcon as string} alt='darkMode'/>
        </IconButton>
      </ToolTip>
      <ToolTip tooltipContent="설정">
        <IconButton onClick={() => {
        }} style={{marginLeft: 5, marginRight: 5}}>
          <img src={settingsIcon as string} alt='settings'/>
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

