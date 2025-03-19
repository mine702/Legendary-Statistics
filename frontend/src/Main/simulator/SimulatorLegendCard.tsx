import style from "./SimulatorLegendCard.module.scss";

interface Props {
  image: string;
  name: string;
}

export const SimulatorLegendCard = (props: Props) => {
  return (
    <div className={style.card}>
      <img src={props.image} alt={props.name} className={style.image}/>
      <p className={style.name}>{props.name}</p>
    </div>
  );
};
