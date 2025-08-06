import {useParams} from "react-router";
import style from "./SimulatorDetail.module.scss";
import {useSWRGetProbabilityByTreasureId, useSWRGetTreasureDetail} from "../../../server/server.ts";
import {useState} from "react";
import simulatorLogo from "../../../assets/img/simulator_logo.png";
import defaultImage from "../../../assets/img/강도깨비.png";
import {SimulatorResult} from "../result/SimulatorResult.tsx";

export const SimulatorDetail = () => {
  const {id} = useParams();

  const {data: treasureData, isLoading: treasureIsLoading} = useSWRGetTreasureDetail(id);
  const {data: probabilityData, isLoading: probabilityIsLoading} = useSWRGetProbabilityByTreasureId(id);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatProbability = (value: number) => {
    const raw = Number(value) * 100;
    return `${raw.toFixed(8)} %`;
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <div className={style.headerWrapper}>
          <img src={simulatorLogo} alt="로고"/>
        </div>
        {treasureIsLoading || probabilityIsLoading ? (
          <div className={style.loading}>로딩중...</div>
        ) : (
          <div className={style.content}>
            <div className={style.detailWrapper}>
              <div className={style.imageBox}>
                <img src={treasureData?.path || defaultImage} alt="전설이 이미지"/>
              </div>

              {/* 오른쪽 확률 정보 */}
              <div className={style.probabilityBox}>
                <p className={style.probabilityBoxHeaderText}>[ {treasureData?.name} ]</p>
                {probabilityData?.map((group) => {
                  const isOpen = openGroups[group.id] ?? false;
                  return (
                    <div key={group.id} className={style.groupItem}>
                      <div className={style.groupHeader}>
                        <span className={style.groupName}>{group.name}</span>
                        <div className={style.rightSection}>
                          <span className={style.groupProbability}>{group.probability} %</span>
                          <button className={style.toggleButton} onClick={() => toggleGroup(group.id)}>
                            {isOpen ? "닫기" : "열기"}
                          </button>
                        </div>
                      </div>
                      {isOpen && (
                        <ul className={style.probabilityList}>
                          {group.probabilityList.map((item) => (
                            <li key={item.id} className={style.probabilityItem}>
                              <span>{item.name}</span>
                              <span className={style.prob}>{formatProbability(item.probability)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <SimulatorResult id={id} name={treasureData?.name}/>
          </div>
        )}
      </div>
    </div>
  );
};
