import style from "./Main.module.scss"
import {TopBar} from "./TopBar.tsx";
import {NavBar} from "./NavBar.tsx";
import {Route, Routes} from "react-router";
import {Home} from "./home/Home.tsx";
import {Redirect} from "../component/Redirect.tsx";
import {Stats} from "./stats/Stats.tsx";
import {List} from "./list/List.tsx";
import {Ranking} from "./ranking/Ranking.tsx";
import {Community} from "./community/Community.tsx";
import {Simulator} from "./simulator/Simulator.tsx";
import {Login} from "./Login/Login.tsx";
import {ToolTipContext, useToolTip} from "../component/tooltip/tooltipContext.ts";
import {ToolTipRenderer} from "../component/tooltip/ToolTipRenderer.tsx";

export const Main = () => {

  const [ttPosition, ttNode, isTtMouseOver, , , , showTooltip, closeTooltip] = useToolTip();

  return (
    <ToolTipContext.Provider value={{showTooltip, closeTooltip}}>
      <div className={style.root}>
        <TopBar/>
        <NavBar/>
        <Routes>
          <Route path="home/*" element={<Home/>}/>
          <Route path="simulator/*" element={<Simulator/>}/>
          <Route path="list/*" element={<List/>}/>
          <Route path="ranking/*" element={<Ranking/>}/>
          <Route path="stats/*" element={<Stats/>}/>
          <Route path="community/*" element={<Community/>}/>
          <Route path="login/*" element={<Login/>}/>
          <Route path="*" element={<Redirect path="/home"/>}/>
        </Routes>
        <ToolTipRenderer tooltipContent={ttNode} tooltipPosition={ttPosition} isMouseOver={isTtMouseOver}/>
      </div>
    </ToolTipContext.Provider>
  )
}
