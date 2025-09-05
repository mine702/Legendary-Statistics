import {useSWRGetLegendListByKind} from "../../server/server.ts";
import {useEffect, useState} from "react";
import style from "./List.module.scss";
import {LegendCard} from "./card/LegendCard.tsx";
import listLogo from "../../assets/img/list_logo.png";
import {KindList} from "../../component/kind/KindList.tsx";
import {useLocation} from "react-router";
import {AdsenseSide} from "../adsense/AdsenseSide.tsx";

export const List = () => {
  const location = useLocation();
  const kindIdFromState = location.state?.kindId;
  const [selectedId, setSelectedId] = useState<number>(1);
  const {data: legendList} = useSWRGetLegendListByKind(selectedId);

  useEffect(() => {
    if (kindIdFromState) {
      setSelectedId(kindIdFromState);
    }
  }, [kindIdFromState]);

  return (
    <div className={style.root}>
      <div className={style.layout}>
        <aside className={style.left}>
          <AdsenseSide placement="left" slot="2131611729"/>
        </aside>

        <main className={style.mid}>
          <div className={style.container}>
            {/* 헤더 이미지 */}
            <div className={style.headerWrapper}>
              <img src={listLogo} alt="로고"/>
            </div>

            <div className={style.content}>
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
        </main>
        <aside className={style.right}>
          <AdsenseSide placement="right" slot="4933444977"/>
        </aside>
      </div>
    </div>
  );
};
