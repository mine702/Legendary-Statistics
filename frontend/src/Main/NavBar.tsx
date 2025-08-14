import style from "./NavBar.module.scss";
import {NavLink} from "react-router";

const menuItems = [
  {label: "홈", path: "/"},
  {label: "보물 왕국 시뮬레이터", path: "/simulator"},
  {label: "꼬마 전설이 리스트", path: "/list"},
  {label: "꼬마 전설이 랭킹", path: "/ranking"},
  {label: "신규 미니 전설이", path: "/new-legend"},
  {label: "커뮤니티", path: "/community"},
];

export const NavBar = () => {
  return (
    <div className={style.root}>
      <div className={style.container}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({isActive}) => `${style.menuBtn} ${isActive ? style.active : ""}`}
            end={item.path === "/"}   // "/"는 정확히 일치할 때만 활성
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
