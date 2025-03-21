// Simulator.tsx
import {Route, Routes} from "react-router-dom";
import {SimulatorDetail} from "./detail/SimulatorDetail";
import {SimulatorMain} from "./main/SimulatorMain"; // 기존 UI를 분리

export const Simulator = () => {
  return (
    <Routes>
      <Route path="/" element={<SimulatorMain/>}/>
      <Route path=":id" element={<SimulatorDetail/>}/>
    </Routes>
  );
};
