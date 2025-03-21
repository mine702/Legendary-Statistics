import style from "./SimulatorMain.module.scss"
import {useSWRGetTreasureList} from "../../../server/server.ts";
import {SimulatorLegendCard} from "../card/SimulatorLegendCard.tsx";

import simulatorLogo from "../../../assets/img/simulator_logo.png";
import {useNavigate} from "react-router-dom";

export const SimulatorMain = () => {
  const {data: list, isLoading} = useSWRGetTreasureList();
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/simulator/${id}`);
  };

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
              <div className={style.textBox}>
                <p className={style.mainText}>
                  이 시뮬레이터는 실제 게임과 동일한 확률로 작동하는 뽑기 시뮬레이터입니다!
                </p>
                <p className={style.subText}>
                  원하는 꼬마 전설이를 뽑을 확률을 직접 확인하고 당신의 운을 확인해 보세요!
                </p>
              </div>
            </div>
          </div>

          <div className={style.listContainer}>
            {
              list?.map((item) => (
                <SimulatorLegendCard key={item.name} item={item} onClick={() => handleCardClick(item.id)}/>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}
