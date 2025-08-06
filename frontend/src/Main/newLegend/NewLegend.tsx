import style from "./NewLegend.module.scss"
import newLegendLogo from "../../assets/img/new_legend_logo.png";
import {useSWRGetNewLegendDetail, useSWRGetNewLegendList} from "../../server/server.ts";
import {ListItem} from "./listItem/ListItem.tsx";
import {useEffect, useRef, useState} from "react";
import thumbUpIcon from "../../assets/icons/thumb_up.svg";
import thumbDownIcon from "../../assets/icons/thumb_down.svg";
import dayts from "../../util/dayts.ts";
import {getRateName} from "../../server/dto/rate.ts";

export const NewLegend = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {data: list, isLoading} = useSWRGetNewLegendList();
  const {data: legend} = useSWRGetNewLegendDetail(selectedId);

  const [legendHeight, setLegendHeight] = useState<number | null>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = legendRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === el) {
          setLegendHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [legend]);

  const handleClickCard = (id: number) => {
    console.log(id)
    setSelectedId(id);
  }

  useEffect(() => {
    if (list && list.length > 0 && selectedId === null) {
      handleClickCard(list[0].id);
    }
  }, [list]);

  return (
    <div className={style.root}>

      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={newLegendLogo} alt="로고"/>
        </div>
        {isLoading ? (
          <div className={style.loading}>로딩중...</div>
        ) : (
          <div className={style.content}>

            <div className={style.listContainer} style={{maxHeight: legendHeight ?? 'auto', overflowY: 'auto'}}>
              {
                list?.map((legend) => (
                  <ListItem key={legend.id} id={legend.id} name={legend.name} onClick={handleClickCard}/>
                ))
              }
            </div>

            <div className={style.legendContainer} ref={legendRef}>
              {legend && (
                <div className={style.legendDetail}>
                  {/* 제목 */}
                  <div className={style.titleArea}>
                    <div className={style.title}>{legend.name}</div>
                    <div>
                      <div className={style.subdataHeader}>생성 날짜</div>
                      {dayts(legend.createdAt).toKoreanDateString()}
                    </div>
                    <div>
                      <div className={style.subdataHeader}>등급</div>
                      {getRateName(legend.rateId)}
                    </div>
                    <div>
                      <div className={style.subdataHeader}>가격</div>
                      신화 메달 {legend.price} 개
                    </div>
                  </div>
                  <h2 className={style.name}>{legend.name}</h2>

                  {/* YouTube 영상 */}
                  <div className={style.videoWrapper}>
                    <iframe
                      src={legend.videoUrl.replace("watch?v=", "embed/")}
                      title="전설 영상"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* 좋아요/싫어요 */}
                  <div className={style.voteWrapper}>
                    <div className={style.voteButton}>
                      <img className={style.thumbUp} src={thumbUpIcon as string} alt="thumbUpIcon"/>
                      <span>{legend.good}</span>
                    </div>
                    <div className={style.voteButton}>
                      <img className={style.thumbDown} src={thumbDownIcon as string} alt="thumbDownIcon"/>
                      <span>{legend.bad}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
