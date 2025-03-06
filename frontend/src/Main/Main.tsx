import style from "./Main.module.scss"
import {Route, Routes, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {MobileMain} from "./MobileMain/MobileMain.tsx";
import {PcMain} from "./PcMain/PcMain.tsx";

export const Main = () => {
  return (
    <div className={`${style.root}`}>
      <Routes>
        <Route path="m/*" element={<MobileMain/>}/>
        <Route path="p/*" element={<PcMain/>}/>
        <Route path="*" element={<RedirectToCorrectPage/>}/>
      </Routes>
    </div>
  )
}

//어떤 페이지로든 이동할 수 없음이 판정된 경우, 로그인 상태에 따라 적절한 페이지로 리다이렉트합니다.
const RedirectToCorrectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("p")
    // navigate(getAgentTypeByWidth() === "mobile" ? "m" : "p");
  }, []);

  return <></>
}
