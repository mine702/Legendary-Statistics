import {useSWRGetKindList} from "../../server/server.ts";
import {useEffect, useState} from "react";
import style from "./List.module.scss";
import image from "../../assets/img/강도깨비.png";

export const List = () => {
  const {data: list, isLoading} = useSWRGetKindList();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [selectedCard, setSelectedCard] = useState<number>(1); // 선택된 카드 상태 추가

  useEffect(() => {
    console.log(selectedCard);
  }, [selectedCard]);

  return (
    <div className={style.root}>
      {isLoading ? (
        <div className={style.loading}>로딩중...</div>
      ) : (
        <div className={style.container}>
          {/* 헤더 이미지 + 그라데이션 */}
          <div className={style.headerWrapper}>
            광고
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

          {/* 메인 콘텐츠 영역 */}
          <div className={style.listContainer}>
            {list?.filter((item) => item.name.includes(searchTerm))
              .map((item) => (
                <div key={item.id} className={style.card} onClick={() => setSelectedCard(item.id)}>
                  <img src={image} alt={item.name} className={style.image}/>
                  <div className={style.name}>{item.name}</div>
                </div>
              ))}
          </div>
          {/* 오른쪽 컨테이너 (빈 공간) */}
          <div className={style.legendContainer}>
          </div>
        </div>
      )}
    </div>
  );
};
