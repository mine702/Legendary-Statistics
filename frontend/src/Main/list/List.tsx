import {useSWRGetLegendListByKind} from "../../server/server.ts";
import {useState} from "react";
import style from "./List.module.scss";
import {LegendCard} from "./card/LegendCard.tsx";
import listLogo from "../../assets/img/list_logo.png";
import {KindList} from "../../component/kind/KindList.tsx";

export const List = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const {data: legendList} = useSWRGetLegendListByKind(selectedId);

  return (
    <div className={style.root}>
      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={listLogo} alt="로고"/>
        </div>

        {/* Kind 리스트 */}
        <KindList selectedId={selectedId} setSelectedId={setSelectedId}/>

        {/* 전설 카드 리스트 */}
        <div className={style.legendContainer}>
          {legendList?.map((legend) => (
            <LegendCard key={legend.name} legend={legend}/>
          ))}
        </div>
      </div>
    </div>
  );
};
