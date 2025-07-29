import style from "./NewLegend.module.scss"
import simulatorLogo from "../../assets/img/simulator_logo.png";

export const NewLegend = () => {
  return (
    <div className={style.root}>

      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={simulatorLogo} alt="로고"/>
        </div>
      </div>
    </div>
  )
}
