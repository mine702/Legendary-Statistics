import style from "./RankingMain.module.scss"
import rankingLogo from "../../../assets/img/ranking_logo.png";
import {RankingResult} from "../result/RankingResult.tsx";

export const RankingMain = () => {
  return (
    <div className={style.root}>

      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={rankingLogo} alt="로고"/>
        </div>
        <div>
          <button>전체</button>
          <button>종류</button>
          <button>한정판</button>
          <button>등급</button>
        </div>
        <div>
          <button>랭킹 투표</button>
        </div>
        <div>
          <RankingResult/>
        </div>
      </div>
    </div>
  )
}
