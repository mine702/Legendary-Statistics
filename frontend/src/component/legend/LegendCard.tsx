import style from "./LegendCard.module.scss";
import {GetLegendListRes} from "../../server/dto/legend.ts";
import {useState} from "react";
import defaultImage from "../../assets/img/강도깨비.png";
import starIcon from "../../assets/icons/star.svg";

interface Props {
  legend: GetLegendListRes
}

export const LegendCard = ({legend}: Props) => {
  // 🔹 기본 별 1짜리 전설을 기본값으로 설정
  const [selectedStar, setSelectedStar] = useState(1);

  // 🔹 현재 선택된 별 개수에 해당하는 전설 찾기
  const currentLegend = legend.legends.find((item) => item.star === selectedStar);

  return (
    <div className={style.root}>
      <img
        src={currentLegend?.path || defaultImage}
        alt={legend.name}
        className={style.image}
      />

      <div className={style.info}>
        <div className={style.name}>{legend.name}</div>
        <div className={style.stars}>
          {legend.legends.map((legend) => (
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
