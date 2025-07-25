import style from "./TopRankingCard.module.scss";

import gold from "../../../assets/img/medal/gold.png";
import silver from "../../../assets/img/medal/silver.png";
import bronze from "../../../assets/img/medal/bronze.png";

interface Props {
  image: string;
  name: string;
  rank: number;
}

export const TopRankingCard = ({image, name, rank}: Props) => {
  const medal = getMedalImage(rank);

  return (
    <div className={style.root}>
      {medal && <img src={medal} alt={`${rank}등`} className={style.medal}/>}
      <img src={image} alt={name} className={style.image}/>
      <div className={style.info}>
        <span className={style.rank}>{rank}위 </span>
        <span className={style.name}>{name}</span>
      </div>
    </div>
  );
};

function getMedalImage(rank: number) {
  switch (rank) {
    case 1:
      return gold;
    case 2:
      return silver;
    case 3:
      return bronze;
    default:
      return undefined;
  }
}
