import style from "./Simulator.module.scss"
import {useSWRGetTreasureList} from "../../server/server.ts";
import {useEffect} from "react";
import {SimulatorLegendCard} from "./SimulatorLegendCard.tsx";
import img from "../../assets/img/강도깨비.png";
import simulatorLogo from "../../assets/img/simulator_logo.png";

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
            <div className={style.descriptionBox}>
              <p className={style.mainText}>
                이 시뮬레이터는 실제 게임과 동일한 확률로 작동하는<span className={style.gachaText}> 뽑기 시뮬레이터</span>입니다!
              </p>
              <p className={style.subText}>
                원하는 <span className={style.legendText}>꼬마 전설이</span>를 뽑을 확률을 직접 확인하고<span className={style.luckyText}> 당신의 운을 확인해 보세요!</span>
              </p>
            </div>
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
