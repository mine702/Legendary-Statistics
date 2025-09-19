import {useEffect, useMemo, useState} from "react";
import style from "./RerollSimulator.module.scss";
import {useSWRGetRerollProbability, useSWRGetSeasons} from "../../../server/server";
import goldIcon from "../../../assets/img/gold.png";

const THRESHOLDS = [0, 2, 4, 10, 20, 40, 76, 124, 200, 284]; // lv1~lv10 누적 EXP

export const RerollSimulator = () => {
  const [seasonId, setSeasonId] = useState<number>(0);
  const [goldSpent, setGoldSpent] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);

  const {data: seasons} = useSWRGetSeasons();
  const {data: probability} = useSWRGetRerollProbability(seasonId || undefined, level);

  useEffect(() => {
    if (seasonId === 0 && seasons?.length) setSeasonId(seasons[0].id);
  }, [seasons, seasonId]);

  useEffect(() => {
    if (probability) console.log(probability);
  }, [probability]);

  const p1 = probability?.level1 ?? 0;
  const p2 = probability?.level2 ?? 0;
  const p3 = probability?.level3 ?? 0;
  const p4 = probability?.level4 ?? 0;
  const p5 = probability?.level5 ?? 0;

  const xp = useMemo(() => {
    let lvl = 1;
    for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
      if (experience >= THRESHOLDS[i]) {
        lvl = i + 1;
        break;
      }
    }
    const prev = THRESHOLDS[lvl - 1];
    const next = THRESHOLDS[lvl] ?? null;
    const inLevel = experience - prev;
    const need = next ? (next - prev) : 0;
    const percent = next ? Math.min(100, Math.max(0, (inLevel / need) * 100)) : 100;
    return {lvl, prev, next, inLevel, need, percent};
  }, [experience]);

  useEffect(() => {
    setLevel(xp.lvl);
  }, [xp.lvl]);

  const isMaxLevel = xp.next === null;

  const handleBuyXp = () => {
    if (isMaxLevel) return;
    setExperience(v => Math.min(v + 4, THRESHOLDS[THRESHOLDS.length - 1]));
    setGoldSpent(g => g + 4);
  };

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

        <div className={style.mid}>
          <span className={style.label}>레벨 :</span>
          <strong className={style.label}>{level}</strong>

          <div className={style.xpWrap} aria-label="경험치 진행도">
            <div className={style.xpBar} role="progressbar"
                 aria-valuemin={0}
                 aria-valuemax={xp.need || 0}
                 aria-valuenow={xp.inLevel || 0}>
              <div className={style.xpFill} style={{width: `${xp.percent}%`}}/>
            </div>
            <div className={`${style.xpText} ${style.label}`}>
              {isMaxLevel ? 'MAX' : <>XP {xp.inLevel}/{xp.need}</>}
            </div>
          </div>
        </div>

        <div className={style.right}>
          <span className={style.label}>사용 :</span>
          <strong className={style.label}>{goldSpent.toLocaleString()}</strong>
          <span className={`${style.label} ${style.unit}`}>골드</span>
        </div>
      </div>

      <div className={style.stage}>
        <div className={style.board} role="grid" aria-label="배치 보드">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className={style.boardRow} role="row">
              {Array.from({length: 7}).map((_, col) => (
                <div key={`${row}-${col}`} className={style.hexCell}>
                  <div className={style.hexInner}/>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={style.bench} aria-label="벤치">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className={style.benchSlot}/>
          ))}
        </div>
      </div>

      <div className={style.refresh}>
        <div className={style.probability}>
          <span className={style.label}>확률 :</span>
          <div className={style.tiers}>
            <span className={`${style.chip} ${style.gray}`}><img src={goldIcon} alt="골드"/>1Lv {p1}%</span>
            <span className={`${style.chip} ${style.green}`}><img src={goldIcon} alt="골드"/>2Lv {p2}%</span>
            <span className={`${style.chip} ${style.blue}`}><img src={goldIcon} alt="골드"/>3Lv {p3}%</span>
            <span className={`${style.chip} ${style.navy}`}><img src={goldIcon} alt="골드"/>4Lv {p4}%</span>
            <span className={`${style.chip} ${style.gold}`}><img src={goldIcon} alt="골드"/>5Lv {p5}%</span>
          </div>
        </div>
        <div>

        </div>
      </div>
      <div className={style.action}>
        <button onClick={handleBuyXp} disabled={isMaxLevel}>경험치 구매</button>
        <button onClick={() => {
        }}>상점 새로고침
        </button>
      </div>
    </div>
  );
};
