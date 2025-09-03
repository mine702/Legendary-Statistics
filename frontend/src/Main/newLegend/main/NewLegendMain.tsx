import style from "./NewLegendMain.module.scss"
import newLegendLogo from "../../../assets/img/new_legend_logo.png";
import {
  useSWRGetNewLegendCommentList,
  useSWRGetNewLegendDetail,
  useSWRGetNewLegendList
} from "../../../server/server.ts";
import {ListItem} from "../listItem/ListItem.tsx";
import {useEffect, useRef, useState} from "react";
import thumbUpIcon from "../../../assets/icons/thumb_up.svg";
import thumbDownIcon from "../../../assets/icons/thumb_down.svg";
import dayts from "../../../util/dayts.ts";
import {getRateName} from "../../../server/dto/rate.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import {toast} from "react-toastify";
import {showToastOnError, showToastOnErrorP1} from "../../../util/errorParser.ts";
import closeIcon from "../../../assets/icons/close.svg";
import {parseJWT} from "../../../util/loginManager.ts";
import {AdsenseSide} from "../../adsense/AdsenseSide.tsx";

export const NewLegendMain = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {data: list, isLoading} = useSWRGetNewLegendList();
  const {data: legend, mutate} = useSWRGetNewLegendDetail(selectedId);
  const {data: comments, mutate: commentMutate} = useSWRGetNewLegendCommentList(selectedId);

  const [searchTerm, setSearchTerm] = useState("");
  const [commentText, setCommentText] = useState<string>("");
  const [legendHeight, setLegendHeight] = useState<number | null>(null);

  const legendRef = useRef<HTMLDivElement>(null);

  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = parseJWT();

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

  const onAddComment = showToastOnError(async () => {
    if (!jwt.sub) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    await axios.post(`new-legend/comment`, {id: selectedId, comment: commentText});
    setCommentText("");
    await commentMutate();
  });

  const handleDeleteComment = showToastOnErrorP1(async (commentId: number) => {
    await axios.delete(`new-legend/comment/${commentId}`);
    toast.success("댓글이 삭제되었습니다.");
    await commentMutate();
  });

  const renderCommentArea = () => {
    if (comments === undefined) return <div className={style.commentItem}>로딩중...</div>
    if (comments.length === 0) return <div className={style.commentItem}>댓글이 없습니다.</div>

    return comments.map((comment, index) =>
      <div key={index} className={style.commentItem}>
        <div className={style.commentHeader}>
          <span className={style.commentUser}>{comment.userName}</span>
          <div className={style.rightArea}>
            <span className={style.createdAt}>{dayts(comment.createdAt).toKoreanDateString()}</span>
            {jwt.sub === comment.userId.toString() && (
              <img
                src={closeIcon}
                alt="삭제"
                className={style.closeIcon}
                onClick={() => handleDeleteComment(comment.id)}
              />
            )}
          </div>
        </div>
        <div className={style.commentContent}>{comment.content}</div>
      </div>
    )
  }

  return (
    <div className={style.root}>
      <div className={style.layout}>
        <aside className={style.left}>
          <AdsenseSide
            placement="left"
            slotLarge="6054446808"
            slotSmall="2131611729"
          />
        </aside>

        <main className={style.mid}>
          <div className={style.container}>
            {/* 헤더 이미지 */}
            <div className={style.headerWrapper}>
              <img src={newLegendLogo} alt="로고"/>
            </div>
            {isLoading ? (
              <div className={style.loading}>로딩중...</div>
            ) : (
              <div className={style.content}>
                <div
                  className={style.listContainer}
                  style={
                    window.innerWidth > 1200
                      ? {maxHeight: legendHeight ?? 'auto'}
                      : undefined
                  }
                >
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

                      <div className={style.comment}>
                        <h3>댓글</h3>
                        <div className="horizontal-line"/>
                        <div className={style.commentInputWrapper}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onAddComment();
                          }
                        }}
                        placeholder="댓글을 입력하세요"
                        className={style.commentInput}
                      />
                          <button onClick={onAddComment} className={style.commentButton}>작성</button>
                        </div>
                        <div className={style.commentList}>
                          {renderCommentArea()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        <aside className={style.right}>
          <AdsenseSide
            placement="right"
            slotLarge="4738289264"
            slotSmall="4933444977"
          />
        </aside>
      </div>
    </div>
  )
}
