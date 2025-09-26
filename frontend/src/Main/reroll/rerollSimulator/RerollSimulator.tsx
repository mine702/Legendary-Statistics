import {useEffect, useMemo, useState} from "react";
import style from "./RerollSimulator.module.scss";
import {
    useSWRGetChampionList,
    useSWRGetRerollProbability,
    useSWRGetSeasons,
    useSWRGetSynergyList
} from "../../../server/server";
import goldIcon from "../../../assets/img/gold.png";
import star1 from "../../../assets/img/tier/1.png";
import star2 from "../../../assets/img/tier/2.png";
import star3 from "../../../assets/img/tier/3.png";
import frame from "../../../assets/icons/synergy/gold.svg";
import {ToolTip} from "../../../component/tooltip/ToolTip";

// loc: 0 = bench, 1 = board
type Unit = {
    id: number;
    star: 1 | 2 | 3;
    loc: 0 | 1;
    slot: number;
};

type CellPos = { loc: 0 | 1; slot: number };

const THRESHOLDS = [0, 2, 4, 10, 20, 40, 76, 124, 200, 284];
const starIconBy = (n: 1 | 2 | 3) => (n === 1 ? star1 : n === 2 ? star2 : star3);
const boardCapByLevel = (lvl: number) => Math.max(1, Math.min(10, lvl));
const useBoardCount = (units: Unit[]) => useMemo(
    () => units.filter(u => u.loc === 1).length, [units]
);

const costClass = (cost?: number) => {
    switch (cost) {
        case 1:
            return style.costGray;
        case 2:
            return style.costGreen;
        case 3:
            return style.costBlue;
        case 4:
            return style.costNavy;
        case 5:
            return style.costGold;
        case 6:
            return style.costOrange;
        default:
            return "";
    }
};

export const RerollSimulator = () => {
    const [seasonId, setSeasonId] = useState<number>(0);
    const [goldSpent, setGoldSpent] = useState(0);
    const [level, setLevel] = useState(1);
    const [experience, setExperience] = useState(0);
    const [selected, setSelected] = useState<CellPos | null>(null);

    const {data: seasons} = useSWRGetSeasons();
    const {data: probability} = useSWRGetRerollProbability(seasonId || undefined, level);
    const {data: champions} = useSWRGetChampionList(seasonId || undefined);
    const {data: synergy} = useSWRGetSynergyList(seasonId || undefined);

    const [units, setUnits] = useState<Unit[]>([
        {id: 1, star: 1, loc: 0, slot: 1},
        {id: 1, star: 1, loc: 1, slot: 10},
        {id: 2, star: 1, loc: 0, slot: 2},
        {id: 40, star: 3, loc: 0, slot: 5},
    ]);

    const boardCount = useBoardCount(units);
    const boardCap = boardCapByLevel(level);
    const isBoardFull = boardCount >= boardCap;

    useEffect(() => {
        if (seasonId === 0 && seasons?.length) setSeasonId(seasons[0].id);
    }, [seasons, seasonId]);

    // 레벨/경험치
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
    const handleRefreshShop = () => {
        setGoldSpent(g => g + 2);
    };

    // 유틸
    const getIndexAt = (arr: Unit[], loc: 0 | 1, slot: number) =>
        arr.findIndex(u => u.loc === loc && u.slot === slot);
    const getUnitAt = (arr: Unit[], loc: 0 | 1, slot: number) =>
        arr.find(u => u.loc === loc && u.slot === slot) ?? null;

    // 클릭 이동/스왑 (보드 수 제한 포함)
    const handleCellClick = (destLoc: 0 | 1, destSlot: number) => {
        setUnits(prev => {
            if (!selected) {
                const hasUnit = !!getUnitAt(prev, destLoc, destSlot);
                if (hasUnit) setSelected({loc: destLoc, slot: destSlot});
                return prev;
            }

            const {loc: srcLoc, slot: srcSlot} = selected;
            if (srcLoc === destLoc && srcSlot === destSlot) {
                setSelected(null);
                return prev;
            }

            const next = [...prev];
            const si = getIndexAt(next, srcLoc, srcSlot);
            if (si < 0) {
                setSelected(null);
                return prev;
            }

            const di = getIndexAt(next, destLoc, destSlot);

            // 보드 제한: 벤치→보드 빈칸 이동 시 막기
            if (destLoc === 1 && di < 0 && srcLoc === 0) {
                const currentBoardCount = prev.filter(u => u.loc === 1).length;
                if (currentBoardCount >= boardCap) {
                    setSelected(null);
                    return prev;
                }
            }

            if (di >= 0) {
                const s = next[si];
                const d = next[di];
                next[si] = {...s, loc: destLoc, slot: destSlot};
                next[di] = {...d, loc: srcLoc, slot: srcSlot};
            } else {
                next[si] = {...next[si], loc: destLoc, slot: destSlot};
            }
            setSelected(null);
            return next;
        });
    };

    // 보드/벤치 셀 배열
    const benchCells = useMemo<(Unit | null)[]>(() => {
        const cells = Array(10).fill(null) as (Unit | null)[];
        for (const u of units) if (u.loc === 0 && u.slot >= 0 && u.slot < 10) cells[u.slot] = u;
        return cells;
    }, [units]);

    const boardCells = useMemo<(Unit | null)[]>(() => {
        const cells = Array(28).fill(null) as (Unit | null)[];
        for (const u of units) if (u.loc === 1 && u.slot >= 0 && u.slot < 28) cells[u.slot] = u;
        return cells;
    }, [units]);

    // id -> 챔피언 메타
    const champById = useMemo(() => {
        const m = new Map<number, any>();
        champions?.forEach((c: any) => m.set(c.id, c));
        return m;
    }, [champions]);

    // 가챠 확률
    const p1 = probability?.level1 ?? 0;
    const p2 = probability?.level2 ?? 0;
    const p3 = probability?.level3 ?? 0;
    const p4 = probability?.level4 ?? 0;
    const p5 = probability?.level5 ?? 0;
    const p6: number | null = probability?.level6 ?? null;

    // 시너지 맵 + 활성 시너지
    const synergyById = useMemo(() => {
        const m = new Map<number, { id: number; name: string; desc: string; path: string }>();
        synergy?.forEach((s: any) => m.set(s.id, s));
        return m;
    }, [synergy]);

    const activeSynergies = useMemo(() => {
        if (!champions) return [];
        const ids = new Set<number>();
        for (const u of units) {
            if (u.loc !== 1) continue; // 보드만 카운트
            const ch = champions.find((c: any) => c.id === u.id);
            ch?.synergyList?.forEach((sid: number) => ids.add(sid));
        }
        return Array.from(ids)
            .map((id) => synergyById.get(id))
            .filter(Boolean) as { id: number; name: string; desc: string; path: string }[];
    }, [units, champions, synergyById]);

    return (
        <div className={style.simulator}>
            {/* Topbar */}
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

            {/* Stage */}
            <div className={style.stage}>
                {/* 보드 */}
                <div className={style.board} role="grid" aria-label="배치 보드">
                    <div className={style.boardTop}>
                        <div className={style.boardTopLeft}>
                            <span className={style.label}>배치 수 : </span>
                            <strong className={style.label}>{boardCount} / {boardCap}</strong>
                        </div>

                        {/* 활성 시너지: 아이콘만 / ToolTip로 설명 */}
                        <div className={style.synergyBar} aria-label="활성 시너지">
                            {activeSynergies.map((s) => (
                                <ToolTip
                                    key={s.id}
                                    tooltipContent={
                                        <div style={{whiteSpace: "pre-line"}}>
                                            <strong style={{display: "block", marginBottom: 6}}>{s.name}</strong>
                                            {s.desc}
                                        </div>
                                    }
                                >
                                    <button type="button" className={style.synItem} aria-label={`${s.name} 시너지 설명`}>
                                        <span className={style.synIconWrap}>
                                          <img className={style.synIcon} src={s.path} alt=""/>
                                          <img className={style.synFrame} src={frame} alt="" aria-hidden/>
                                        </span>
                                    </button>
                                </ToolTip>
                            ))}
                        </div>
                    </div>

                    {[0, 1, 2, 3].map((row) => (
                        <div key={row} className={style.boardRow} role="row">
                            {Array.from({length: 7}).map((_, col) => {
                                const idx = row * 7 + col;
                                const cell = boardCells[idx];
                                const meta = cell ? champById.get(cell.id) : null;
                                const isSelected = selected?.loc === 1 && selected?.slot === idx;

                                return (
                                    <div
                                        key={idx}
                                        className={`${style.hexCell} ${style.clickable} ${isSelected ? style.selected : ""} ${
                                            !cell && isBoardFull && selected?.loc === 0 ? style.disabled : ""
                                        }`}
                                        onClick={() => handleCellClick(1, idx)}
                                    >
                                        <div className={style.hexInner}>
                                            {meta && (
                                                <>
                                                    <img className={style.unitImgBoard} src={meta.squarePath} alt=""
                                                         draggable={false}/>
                                                    <div className={style.boardName}>
                                                        <span className={style.boardNameText}>{meta.name}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {cell && (
                                            <div className={style.boardStarWrap}>
                                                <img className={style.boardStar} src={starIconBy(cell!.star)} alt=""/>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* 벤치 */}
                <div className={style.bench} aria-label="벤치">
                    {benchCells.map((cell, i) => {
                        const meta = cell ? champById.get(cell.id) : null;
                        const costCls = meta ? costClass(meta.cost) : "";
                        const isSelected = selected?.loc === 0 && selected?.slot === i;

                        return (
                            <div
                                key={i}
                                className={`${style.benchSlot} ${style.clickable} ${costCls} ${isSelected ? style.selected : ""}`}
                                onClick={() => handleCellClick(0, i)}
                            >
                                {meta && (
                                    <>
                                        <img className={style.unitImgBench} src={meta.mobilePath} alt=""
                                             draggable={false}/>
                                        <div className={style.benchStarWrap}>
                                            <img className={style.benchStar} src={starIconBy(cell!.star)} alt=""/>
                                        </div>
                                        <div className={style.benchName}>
                                            <span className={style.benchNameText}>{meta.name}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 하단: 확률/상점 자리 */}
            <div className={style.refresh}>
                <div className={style.tiers}>
                    <span className={`${style.chip} ${style.gray}`}><img src={goldIcon} alt="골드"/>1Lv {p1}%</span>
                    <span className={`${style.chip} ${style.green}`}><img src={goldIcon} alt="골드"/>2Lv {p2}%</span>
                    <span className={`${style.chip} ${style.blue}`}><img src={goldIcon} alt="골드"/>3Lv {p3}%</span>
                    <span className={`${style.chip} ${style.navy}`}><img src={goldIcon} alt="골드"/>4Lv {p4}%</span>
                    <span className={`${style.chip} ${style.gold}`}><img src={goldIcon} alt="골드"/>5Lv {p5}%</span>
                    {p6 != null && (
                        <span className={`${style.chip} ${style.orange}`}><img src={goldIcon} alt="골드"/>6Lv {p6}%</span>
                    )}
                </div>
                <div className={style.shop}/>
            </div>

            <div className={style.action}>
                <button onClick={handleBuyXp} disabled={isMaxLevel}>경험치 구매</button>
                <button onClick={handleRefreshShop}>상점 새로고침</button>
            </div>
        </div>
    );
};
