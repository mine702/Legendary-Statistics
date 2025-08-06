import style from "./ListItem.module.scss"

interface Props {
  id: number
  name: string
  onClick?: (id: number) => void // 클릭 시 id 넘기기
}

export const ListItem = (props: Props) => {

  const handleClick = () => {
    if (props.onClick) props.onClick(props.id)
  }

  return (
    <div className={style.card} onClick={handleClick}>
      <div className={style.name}>{props.name}</div>
    </div>
  )
}
