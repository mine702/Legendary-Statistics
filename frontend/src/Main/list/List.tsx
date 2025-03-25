import {useSWRGetKindList, useSWRGetLegendListByKind} from "../../server/server.ts";
import {useState} from "react";
import style from "./List.module.scss";
import defaultImage from "../../assets/img/강도깨비.png";
import {LegendCard} from "./card/LegendCard.tsx";

import listLogo from "../../assets/img/list_logo.png";

export const List = () => {
  const {data: list, isLoading} = useSWRGetKindList();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number>(1);
  const {data: legendList} = useSWRGetLegendListByKind(selectedId);

  return (
    <div className={style.root}>
      {isLoading ? (
        <div className={style.loading}>로딩중...</div>
      ) : (
        <div className={style.container}>
          {/* 헤더 이미지 */}
          <div className={style.headerWrapper}>
            <img src={listLogo} alt="로고"/>
          </div>

          {/* 검색창 */}
          <div className={style.searchBar}>
            <input
              type="text"
              placeholder="꼬마 전설이 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 리스트 선택 */}
          <div className={style.listContainer}>
            {list?.filter((item) => item.name.includes(searchTerm)).map((item) => (
              <div key={item.id} className={style.card} onClick={() => setSelectedId(item.id)}>
                <img src={item?.path || defaultImage} alt={item.name} className={style.image}/>
                <div className={style.name}>{item.name}</div>
              </div>
            ))}
          </div>

          {/* 🟢 LegendCard 적용된 부분 */}
          <div className={style.legendContainer}>
            {legendList?.map((legend) => (
              <LegendCard key={legend.name} legend={legend}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
