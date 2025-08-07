import style from "./LegendCard.module.scss";
import {GetLegendListRes} from "../../../server/dto/legend.ts";
import {useState} from "react";
import defaultImage from "../../../assets/img/강도깨비.png";
import rate1 from "../../../assets/img/rate/1.png";
import rate2 from "../../../assets/img/rate/2.png";
import rate3 from "../../../assets/img/rate/3.png";
import rate4 from "../../../assets/img/rate/4.png";
import tier1 from "../../../assets/img/tier/1.png";
import tier2 from "../../../assets/img/tier/2.png";
import tier3 from "../../../assets/img/tier/3.png";

interface Props {
  legend: GetLegendListRes;
}

export const LegendCard = (props: Props) => {
  const [selectedStar, setSelectedStar] = useState(1);

  const currentLegend = props.legend.legends.find(
    (item) => item.star === selectedStar
  );

  const getRateImage = (rateId: number) => {
    switch (rateId) {
      case 1:
        return rate1;
      case 2:
        return rate2;
      case 3:
        return rate3;
      case 4:
        return rate4;
      default:
        return null;
    }
  };

  const getTierImage = (star: number) => {
    switch (star) {
      case 1:
        return tier1;
      case 2:
        return tier2;
      case 3:
        return tier3;
      default:
        return tier1;
    }
  };

  const rateImage = getRateImage(props.legend.rateId);

  return (
    <div className={style.root}>
      <img
        src={currentLegend?.path || defaultImage}
        alt={props.legend.name}
        className={style.image}
      />
      {rateImage && (
        <div className={style.rateWrapper}>
          <img
            src={rateImage}
            alt={`등급 ${props.legend.rateId}`}
            className={style.rateImage}
          />
        </div>
      )}
      <div className={style.info}>
        <div className={style.name}>{props.legend.name}</div>
        <div className={style.stars}>
          {props.legend.legends.map((legend) => (
            <img
              key={legend.id}
              src={getTierImage(legend.star)}
              alt={`${legend.star}성`}
              className={`${style.starImage} ${selectedStar === legend.star ? style.active : ""}`}
              onClick={() => setSelectedStar(legend.star)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
