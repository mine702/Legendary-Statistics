import style from "./SimulatorLegendCard.module.scss";

interface Props {
  image: string;
  legendId: string;
}

export const SimulatorLegendCard = (props: Props) => {
  return (
    <div className={style.card}>
      <img src={props.image} alt={props.legendId} className={style.image}/>
    </div>
  );
};
