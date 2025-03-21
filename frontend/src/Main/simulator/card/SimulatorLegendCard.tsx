import style from "./SimulatorLegendCard.module.scss";
import {GetTreasureListRes} from "../../../server/dto/treasure.ts";
import img from "../../../assets/img/강도깨비.png";

interface Props {
  item: GetTreasureListRes;
  onClick: () => void;
}

export const SimulatorLegendCard = (props: Props) => {
  return (
    <div className={style.card} onClick={props.onClick}>
      <img src={props.item.path ? props.item.path : img} alt={props.item.name} className={style.image}/>
      <p className={style.name}>{props.item.name}</p>
    </div>
  );
};
