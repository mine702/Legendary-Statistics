// src/components/reroll/RerollSimulator.tsx
import {useEffect, useState} from "react";
import style from "./RerollSimulator.module.scss";
import {useSWRGetSeasons} from "../../../server/server";

export const RerollSimulator = () => {
  const {data: seasons} = useSWRGetSeasons();

  const [seasonId, setSeasonId] = useState<number | "">("");

  useEffect(() => {
    if (seasonId === "" && seasons?.length) setSeasonId(seasons[0].id);
  }, [seasons, seasonId]);

  const [goldSpent] = useState(120);

  return (
    <div className={style.simulator}>
      <div className={style.topbar}>
        <div className={style.left}>
          <label className={style.label} htmlFor="seasonSelect">시즌 :</label>
          <select
            id="seasonSelect"
            className={style.select}
            value={seasonId}
            onChange={(e) => setSeasonId(Number(e.target.value))}
          >
            {seasons?.map((s: any) => (
              <option key={s.id} value={s.id}>S{s.seasonNo}</option>
            ))}
          </select>
        </div>

        <div className={style.right}>
          <span className={style.label}>사용량 :</span>
          <strong className={style.goldNum}>{goldSpent.toLocaleString()}</strong>
          <span className={style.unit}>골드</span>
        </div>
      </div>
    </div>
  );
};
