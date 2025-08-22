import style from "./Main.module.scss"
import {TopBar} from "./TopBar.tsx";
import {NavBar} from "./NavBar.tsx";
import {Route, Routes} from "react-router";
import {Home} from "./home/Home.tsx";
import {List} from "./list/List.tsx";
import {Ranking} from "./ranking/Ranking.tsx";
import {Community} from "./community/Community.tsx";
import {Simulator} from "./simulator/Simulator.tsx";
import {Login} from "./Login/Login.tsx";
import {ToolTipContext, useToolTip} from "../component/tooltip/tooltipContext.ts";
import {ToolTipRenderer} from "../component/tooltip/ToolTipRenderer.tsx";
import {NewLegend} from "./newLegend/NewLegend.tsx";
import {MyPage} from "./myPage/MyPage.tsx";

export const Main = () => {

  const [ttPosition, ttNode, isTtMouseOver, , , , showTooltip, closeTooltip] = useToolTip();

  return (
    <ToolTipContext.Provider value={{showTooltip, closeTooltip}}>
      <div className={style.root}>
        <TopBar/>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="simulator/*" element={<Simulator/>}/>
          <Route path="list/*" element={<List/>}/>
          <Route path="ranking/*" element={<Ranking/>}/>
          <Route path="new-legend/*" element={<NewLegend/>}/>
          <Route path="community/*" element={<Community/>}/>
          <Route path="login/*" element={<Login/>}/>
          <Route path="my-page" element={<MyPage/>}/>
          <Route path="*" element={<Home/>}/>
        </Routes>
        <ToolTipRenderer tooltipContent={ttNode} tooltipPosition={ttPosition} isMouseOver={isTtMouseOver}/>
      </div>
    </ToolTipContext.Provider>
  )
}
