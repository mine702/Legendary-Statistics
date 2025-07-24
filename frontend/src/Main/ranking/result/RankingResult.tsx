import style from "./RankingResult.module.scss"

export const RankingResult = () => {
  return (
    <div className={style.root}>
      <h1>랭킹 결과</h1>
      <div>
        <div>
          <h2>랭킹 1위</h2>
          <p>이름: 김철수</p>
          <p>점수: 1000점</p>
        </div>
        <div>
          <h2>랭킹 2위</h2>
          <p>이름: 김철수</p>
          <p>점수: 1000점</p>
        </div>
        <div>
          <h2>랭킹 3위</h2>
          <p>이름: 김철수</p>
          <p>점수: 1000점</p>
        </div>
      </div>
    </div>
  );
}
