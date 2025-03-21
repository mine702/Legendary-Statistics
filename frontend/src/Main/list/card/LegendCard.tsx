import style from "./LegendCard.module.scss";
import {GetLegendListRes} from "../../../server/dto/legend.ts";
import {useState} from "react";
import defaultImage from "../../../assets/img/강도깨비.png";
import starIcon from "../../../assets/icons/star.svg";
import rate1 from "../../../assets/img/rate/1.png";
import rate2 from "../../../assets/img/rate/2.png";
import rate3 from "../../../assets/img/rate/3.png";
import rate4 from "../../../assets/img/rate/4.png";
import rate5 from "../../../assets/img/rate/5.png";

interface Props {
  legend: GetLegendListRes
}

export const LegendCard = (props: Props) => {
  // 🔹 기본 별 1짜리 전설을 기본값으로 설정
  const [selectedStar, setSelectedStar] = useState(1);

  // 🔹 현재 선택된 별 개수에 해당하는 전설 찾기
  const currentLegend = props.legend.legends.find((item) => item.star === selectedStar);

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
      case 5:
        return rate5;
      default:
        return null;
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
          <img src={rateImage} alt={`등급 ${props.legend.rateId}`} className={style.rateImage}/>
        </div>
      )}
      <div className={style.info}>
        <div className={style.name}>{props.legend.name}</div>
        <div className={style.stars}>
          {props.legend.legends.map((legend) => (
            <button
              key={legend.id}
              className={`${style.starButton} ${selectedStar === legend.star ? style.active : ""}`}
              onClick={() => setSelectedStar(legend.star)}
            >
              <img src={starIcon} alt={legend.path}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
