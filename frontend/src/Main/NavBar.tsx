import style from "./NavBar.module.scss";
import {useLocation, useNavigate} from "react-router";

const menuItems = [
  {label: "홈", path: "/home"},
  {label: "보물 왕국 시뮬레이터", path: "/simulator"},
  {label: "꼬마 전설이 리스트", path: "/list"},
  {label: "꼬마 전설이 랭킹", path: "/ranking"},
  {label: "실시간 통계", path: "/stats"},
  {label: "커뮤니티", path: "/community"},
  {label: "신규 꼬마 전설이", path: "/inquiry"},
];

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={style.root}>
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`${style.menuBtn} ${location.pathname.includes(item.path) ? style.active : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
