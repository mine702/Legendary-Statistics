import style from "./SimulatorMain.module.scss"
import {useSWRGetTreasureList} from "../../../server/server.ts";
import {SimulatorLegendCard} from "../card/SimulatorLegendCard.tsx";

import simulatorLogo from "../../../assets/img/simulator_logo.png";
import {useNavigate} from "react-router";

export const SimulatorMain = () => {
  const {data: list, isLoading} = useSWRGetTreasureList();
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/simulator/${id}`);
  };

  return (
    <div className={style.root}>

      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={simulatorLogo} alt="로고"/>
        </div>
        {isLoading ? (
          <div className={style.loading}>로딩중...</div>
        ) : (
          <div className={style.listContainer}>
            {
              list?.map((item) => (
                <SimulatorLegendCard key={item.name} item={item} onClick={() => handleCardClick(item.id)}/>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}
