import style from "./RankingResult.module.scss";
import {GetRankingRes} from "../../../server/dto/ranking.ts";
import {RankingCard} from "../card/RankingCard.tsx";

interface Props {
  value: GetRankingRes[] | undefined;
  start: number | undefined;
  size: number | undefined;
}

export const RankingResult = (props: Props) => {
  if (!props.value || props.value.length === 0) {
    return <div className={style.root}>데이터가 없습니다.</div>;
  }

  const top3 = props.value.filter((item) => item.rank <= 3);
  const rest = props.value.filter((item) => item.rank > 3);

  return (
    <div className={style.root}>
      {/* 1~3등 */}
      {top3.length > 0 && (
        <div className={style.top}>
          {top3.length === 1 && (
            <RankingCard
              rank={top3[0].rank}
              image={top3[0].path}
              name={top3[0].name}
            />
          )}

          {top3.length === 2 && (
            <>
              <RankingCard
                rank={top3[0].rank}
                image={top3[0].path}
                name={top3[0].name}
              />
              <RankingCard
                rank={top3[1].rank}
                image={top3[1].path}
                name={top3[1].name}
              />
            </>
          )}

          {top3.length === 3 && (
            <>
              <div className={style.second}>
                <RankingCard
                  rank={2}
                  image={top3[1].path}
                  name={top3[1].name}
                />
              </div>
              <div className={style.first}>
                <RankingCard
                  rank={1}
                  image={top3[0].path}
                  name={top3[0].name}
                />
              </div>
              <div className={style.third}>
                <RankingCard
                  rank={3}
                  image={top3[2].path}
                  name={top3[2].name}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* 4등 이후 */}
      <div className={style.restList}>
        {rest.map((item) => (
          <RankingCard
            key={item.id}
            rank={item.rank}
            image={item.path}
            name={item.name}
          />
        ))}
      </div>
    </div>
  );
};
