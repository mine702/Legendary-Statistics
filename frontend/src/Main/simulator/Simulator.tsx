import style from "./Simulator.module.scss"
import {useSWRGetTreasureList} from "../../server/server.ts";
import {useEffect} from "react";
import {SimulatorLegendCard} from "./SimulatorLegendCard.tsx";
import img from "../../assets/img/강도깨비.png";
import simulatorLogo from "../../assets/img/simulator_logo.png";
import simulatorText1 from "../../assets/img/simulator_text_1.png";
import simulatorText2 from "../../assets/img/simulator_text_2.png";

export const Simulator = () => {
  const {data: list, isLoading} = useSWRGetTreasureList();

  useEffect(() => {
    console.log(list);
  }, [list]);

  return (
    <div className={style.root}>
      {isLoading ? (
        <div className={style.loading}>로딩중...</div>
      ) : (
        <div className={style.container}>
          {/* 헤더 이미지 */}
          <div className={style.headerWrapper}>
            <img src={simulatorLogo} alt="로고"/>
          </div>
          <div className={style.headerText}>
            <img src={simulatorText1} alt="텍스트1" className={style.textImage}/>
            <img src={simulatorText2} alt="텍스트2" className={style.textImage}/>
          </div>
          <div className={style.listContainer}>
            {
              list?.map((item) => (
                <SimulatorLegendCard image={img} name={item.name}/>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}
