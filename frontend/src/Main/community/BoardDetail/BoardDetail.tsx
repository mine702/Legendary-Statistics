import style from "./BoardDetail.module.scss"
import {useNavigate, useParams} from "react-router";
import {
  useSWRBoardCategories,
  useSWRGetBoardCommentList,
  useSWRGetBoardDetail,
  useSWRGetLastTimeBoard
} from "../../../server/server.ts";
import {parseJWT} from "../../../util/loginManager.ts";
import {useState} from "react";
import axios from "axios";
import {showToastOnError, showToastOnErrorP1} from "../../../util/errorParser.ts";
import {toast} from "react-toastify";
import {isImage} from "../../../util/fileNameParser.ts";
import {requestURL} from "../../../config.ts";
import {MultiFileUploader} from "../../../component/MultiFileUploader.tsx";
import dayts from "../../../util/dayts.ts";
import closeIcon from "../../../assets/icons/close.svg";
import {showConfirmToast} from "../../../component/simple/ConfirmToast.tsx";

export const BoardDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const initId = parseInt(params.id as string);
  const {data} = useSWRGetBoardDetail(initId);
  const [commentText, setCommentText] = useState<string>("");
  const {data: comments, mutate} = useSWRGetBoardCommentList(initId);
  const {mutate: getLastTime} = useSWRGetLastTimeBoard();
  const {data: categoryInfo} = useSWRBoardCategories();

  const jwt = parseJWT();

  const onClickEdit = () => {
    navigate(`../edit/${initId}`);
  }

  const onClickDelete = () => {
    showConfirmToast({
      message: "정말 삭제하시겠습니까?",
      onConfirm: onConfirmDelete
    });
  };
  
  const onConfirmDelete = showToastOnError(async () => {
    await axios.delete(`board/${initId}`)
    toast.success("게시글이 삭제되었습니다.");
    navigate(-1);
    await getLastTime();
  });

  const handleDeleteComment = showToastOnErrorP1(async (commentId: number) => {
    await axios.delete(`board/comment/${commentId}`);
    toast.success("댓글이 삭제되었습니다.");
    await mutate();
  });

  if (!data) return <div></div>
  const targetCategoryInfo = categoryInfo?.find(item => item.name === data.category)?.label ?? "";

  const onAddComment = showToastOnError(async () => {
    await axios.post(`board/comment`, {boardId: initId, comment: commentText});
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
      <h1 style={{marginBottom: "20px"}}>
        {"게시글"}</h1>
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
          {targetCategoryInfo}
        </div>
      </div>
      <h3>내용</h3>
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

      <div className={style.buttonArea}>
        <button onClick={() => navigate(-1)}>뒤로</button>
        {(data.userId.toString() == jwt.sub &&
            <>
                <button className="ml" onClick={onClickEdit}>수정</button>
                <button className="ml" onClick={onClickDelete}>삭제</button>
            </>)}
      </div>
    </div>
  )
}
