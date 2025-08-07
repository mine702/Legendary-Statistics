import style from "./NewLegendMain.module.scss"
import newLegendLogo from "../../../assets/img/new_legend_logo.png";
import {useSWRGetNewLegendDetail, useSWRGetNewLegendList} from "../../../server/server.ts";
import {ListItem} from "../listItem/ListItem.tsx";
import {useEffect, useRef, useState} from "react";
import thumbUpIcon from "../../../assets/icons/thumb_up.svg";
import thumbDownIcon from "../../../assets/icons/thumb_down.svg";
import dayts from "../../../util/dayts.ts";
import {getRateName} from "../../../server/dto/rate.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import {toast} from "react-toastify";

export const NewLegendMain = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {data: list, isLoading} = useSWRGetNewLegendList();
  const {data: legend, mutate} = useSWRGetNewLegendDetail(selectedId);

  const [searchTerm, setSearchTerm] = useState("");

  const [legendHeight, setLegendHeight] = useState<number | null>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const {executeRecaptcha} = useGoogleReCaptcha();

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
    setSelectedId(id);
  }

  useEffect(() => {
    if (list && list.length > 0 && selectedId === null) {
      handleClickCard(list[0].id);
    }
  }, [list]);


  const handleVote = async (type: "good" | "bad") => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const token = await executeRecaptcha("vote");
      await axios.post("new-legend/vote", {
        id: selectedId,
        type,
        token,
      }).then(() => {
        mutate()
      });
    } catch (err) {
      toast.error("오류 발생 잠시후 다시 시도해주세요.");
    }
  };


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

            <div className={style.listContainer} style={{maxHeight: legendHeight ?? 'auto'}}>
              <div className={style.searchContainer}>
                <input
                  type="text"
                  placeholder="전설 이름으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={style.listItems}>
                {
                  list
                    ?.filter(legend => legend.name.includes(searchTerm))
                    .map((legend) => (
                      <ListItem key={legend.id} id={legend.id} name={legend.name} rateId={legend.rateId}
                                onClick={handleClickCard}/>
                    ))
                }
              </div>

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
                    <div className={style.voteButton} onClick={() => handleVote("good")}>
                      <img className={style.thumbUp} src={thumbUpIcon} alt="thumbUpIcon"/>
                      <span>{legend.good}</span>
                    </div>

                    <div className={style.voteButton} onClick={() => handleVote("bad")}>
                      <img className={style.thumbDown} src={thumbDownIcon} alt="thumbDownIcon"/>
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
