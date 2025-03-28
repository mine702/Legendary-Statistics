import style from "./Main.module.scss"
import {TopBar} from "./TopBar.tsx";
import {NavBar} from "./NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {Home} from "./home/Home.tsx";
import {Redirect} from "../component/Redirect.tsx";
import {Stats} from "./stats/Stats.tsx";
import {List} from "./list/List.tsx";
import {Ranking} from "./ranking/Ranking.tsx";
import {Community} from "./community/Community.tsx";
import {Simulator} from "./simulator/Simulator.tsx";
import {Champion} from "./champion/Champion.tsx";
import {Battle} from "./battle/Battle.tsx";

export const Main = () => {
  return (
    <div className={style.root}>
      <TopBar/>
      <NavBar/>
      <Routes>
        <Route path="home/*" element={<Home/>}/>
        <Route path="simulator/*" element={<Simulator/>}/>
        <Route path="list/*" element={<List/>}/>
        <Route path="ranking/*" element={<Ranking/>}/>
        <Route path="champion/*" element={<Champion/>}/>
        <Route path="battle/*" element={<Battle/>}/>
        <Route path="stats/*" element={<Stats/>}/>
        <Route path="community/*" element={<Community/>}/>
        <Route path="*" element={<Redirect path="home"/>}/>
      </Routes>
    </div>
  )
}
