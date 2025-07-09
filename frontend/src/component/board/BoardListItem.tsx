import style from "./BoardListItem.module.scss"
import {isNew} from "../../util/datetimeDifference.ts";
import {Space} from "../simple/Space.tsx";
import {GetBoardListRes} from "../../server/dto/board.ts";

interface Props {
  onClickItem: (id: number) => void;
  item: GetBoardListRes;
}

export const BoardListItem = (props: Props) => {
  const item = props.item;
  return (
    <div className={style.card} onClick={() => props.onClickItem(item.id)}>
      <div className={style.titleArea}>
        <div className={style.title}>
          {item.title}
          {isNew(item.createdAt) && <span className={style.newBadge}>NEW</span>}
        </div>
        <div className={style.date}>{`${item.createdAt}`}
          {item.userName}
        </div>
      </div>
      <Space/>
    </div>
  )
}
