import style from "./ListItem.module.scss"
import {getRateColor} from "../../../server/dto/rate.ts";

interface Props {
  id: number
  name: string
  rateId: number
  onClick?: (id: number) => void // 클릭 시 id 넘기기
}

export const ListItem = (props: Props) => {

  const handleClick = () => {
    if (props.onClick) props.onClick(props.id)
  }

  const barColor = getRateColor(props.rateId)

  return (
    <div className={style.card} onClick={handleClick}>
      <div className={style.cardContent}>
        <div className={style.bar} style={{backgroundColor: barColor}}/>
        <div className={style.name}>{props.name}</div>
      </div>
    </div>
  )
}
