import style from "./BoardListItem.module.scss"
import {isNew} from "../../util/datetimeDifference.ts";
import {Space} from "../simple/Space.tsx";

interface Props {
  onClickItem: (id: number) => void;
  hideUsername?: boolean;
}

export const BoardListItem = (props: Props) => {
  const hideUsername = props.hideUsername ?? false;

  const renderAnswerStateLabel = (item: GetInquiryListRes) => {
    if (props.inquiryTypeInfo?.hideAnswer) return null;

    return item.answerAt != null ?
      <div className={`${style.tag} ${style.answered}`}>답변완료</div> :
      <div className={`${style.tag} ${style.wait}`}>대기중</div>
  }

  const item = props.item;
  return (
    <div className={style.card} onClick={() => props.onClickItem(item.id)}>
      <div className={style.titleArea}>
        <div className={style.title}>
          {item.title}
          {isNew(item.createdAt) && <span className={style.newBadge}>NEW</span>}
        </div>
        <div className={style.date}>{`${item.createdAt}, ${item.category}`}
          {!hideUsername ? `, ${item.userName}` : null}
          {item.shared ? ', 개발팀 수정 가능' : null}
        </div>
      </div>
      <Space/>
      {renderAnswerStateLabel(item)}
    </div>
  )
}
