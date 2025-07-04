import style from "./BoardDetail.module.scss"
import {useNavigate, useParams} from "react-router";
import {
  useSWRGetInquiryCommentList,
  useSWRGetLastTimeInquiry,
  useSWRInquiryCategories,
  useSWRMyInquiry,
  useSWRUserSettings
} from "../../../../../server/server.ts";
import {parseJWT} from "../../../../../util/loginManager.ts";
import {useContext, useState} from "react";
import {PopupContext} from "../../../../../context/PopupContext.ts";
import {ConfirmPopup} from "../../../../../component/popup/ConfirmPopup.tsx";
import axios from "axios";
import {showToastOnError} from "../../../../../util/errorParser.ts";
import {toast} from "react-toastify";
import {isImage} from "../../../../../util/fileNameParser.ts";
import {requestURL} from "../../../../../config.ts";
import {MultiFileUploader} from "../../../../../component/MultiFileUploader.tsx";
import dayjs from "dayjs";

export const BoardDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const initId = parseInt(params.id);
  const popupContext = useContext(PopupContext);
  const {data} = useSWRMyInquiry(initId);
  const [commentText, setCommentText] = useState<string>("");
  const {data: comments, mutate} = useSWRGetInquiryCommentList(initId);
  const {data: userSettings} = useSWRUserSettings();
  const {mutate: getLastTime} = useSWRGetLastTimeInquiry();
  const {data: categoryInfo} = useSWRInquiryCategories();

  const jwt = parseJWT();

  const onClickEdit = () => {
    navigate(`../edit/${initId}`);
  }

  const onClickDelete = () => {
    popupContext.addPopup(popupId =>
      <ConfirmPopup message="정말로 삭제하시겠습니까?"
                    onCancel={() => () => {
                    }}
                    onConfirm={onConfirmDelete} key={popupId} popupId={popupId}/>
    )
  }

  const onConfirmDelete = showToastOnError(async () => {
    await axios.delete(`inquiry/${initId}`)
    toast.success("문의가 삭제되었습니다.");
    navigate(-1);
    await getLastTime();
  });

  if (!data) return <div></div>
  const targetCategoryInfo = categoryInfo[data.category];

  const onAddComment = showToastOnError(async () => {
    await axios.post(`inquiry/comment`, {inquiryId: initId, comment: commentText});
    setCommentText("");
    await mutate();
  });

  const renderCommentArea = () => {
    if (comments === undefined) return <div className={style.commentItem}>로딩중...</div>
    if (comments.length === 0) return <div className={style.commentItem}>댓글이 없습니다.</div>

    return comments.map((comment, index) =>
      <div key={index} className={style.commentItem}>
        <div className={style.commentHeader}>
          <span className={style.commentUser}>{comment.userName}</span>
          <span
            className={style.createdAt}>{dayjs(comment.createdAt).toKoreanDateTimeString(userSettings.timeDisplayFormat)}</span>
        </div>
        <div className={style.commentContent}>{comment.comment}</div>
      </div>)
  }

  return (
    <div className={style.root}>
      <h1 style={{marginBottom: "40px"}}>
        {targetCategoryInfo?.hideAnswer ? targetCategoryInfo?.displayTitle : "문의 기록"}</h1>
      <div className={style.titleArea}>
        <div className={style.title}>{data.title}</div>
        <div>
          <div className={style.subdataHeader}>등록자</div>
          {data.userName}
        </div>
        <div>
          <div className={style.subdataHeader}>등록일</div>
          {data.createdAt}
        </div>
        <div>
          <div className={style.subdataHeader}>분류</div>
          {data.category} {data.shared ? "(개발팀 수정 가능)" : null}
        </div>
        {!targetCategoryInfo?.hideAnswer && <div>
            <div className={style.subdataHeader}>상태</div>
          {data.answerAt != null ?
            <div className={`${style.tag} ${style.answered}`}>답변완료</div> :
            <div className={`${style.tag} ${style.wait}`}>대기중</div>}
        </div>}
      </div>
      <h3>{targetCategoryInfo?.hideAnswer ? "내용" : "질문 내용"}</h3>
      <div className="horizontal-line"/>
      <div className={style.content}>
        {data.content}
      </div>
      {data.files.length > 0 && <>
          <h4 className="no-margin">첨부파일</h4>
          <div>
              <MultiFileUploader value={data.files} disabled={true}/>
          </div>
      </>}
      {
        data.files.map((file, index) => (
          <div key={index}>
            {isImage(file.actualFileName) ?
              <img src={`${requestURL}/file/${file.id}`} alt="첨부 이미지" className={style.image}/> : null}
          </div>
        ))
      }
      {!targetCategoryInfo?.hideAnswer && <div>
          <h3>답변 내용</h3>
          <div className="horizontal-line"/>
        {data.answerAt == null ? <div>아직 답변이 없습니다. 잠시만 기다려주세요.</div> :
          <div className={style.answer}>{data.answer}</div>}
      </div>}
      {!targetCategoryInfo?.prohibitComment && <div className={style.comment}>
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
      </div>}

      <div className={style.buttonArea}>
        <button onClick={() => navigate(-1)}>뒤로</button>
        {(data.userId.toString() == jwt.sub || (data.shared && jwt.dev)) && <>
            <button className="ml" onClick={onClickEdit}>수정</button>
            <button className="ml" onClick={onClickDelete}>삭제</button>
        </>}
      </div>
    </div>
  )
}
