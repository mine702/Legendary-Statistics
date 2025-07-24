// Simulator.tsx
import {Route, Routes} from "react-router";
import {RankingMain} from "./main/RankingMain.tsx";
import {RankingVote} from "./vote/RankingVote.tsx"; // 기존 UI를 분리

export const Ranking = () => {
  return (
    <Routes>
      <Route path="/" element={<RankingMain/>}/>
      <Route path="vote" element={<RankingVote/>}/>
    </Routes>
  );
};
