import {useEffect, useMemo, useState} from "react";
import style from "./RerollSimulator.module.scss";
import {useSWRGetChampionList, useSWRGetRerollProbability, useSWRGetSeasons} from "../../../server/server";
import goldIcon from "../../../assets/img/gold.png";

const THRESHOLDS = [0, 2, 4, 10, 20, 40, 76, 124, 200, 284];

// loc: 0: bench, 1: board
type Unit = {
    id: number;
    star: 1 | 2 | 3;
    loc: 0 | 1;
    slot: number;
};

export const RerollSimulator = () => {
    const [seasonId, setSeasonId] = useState<number>(0);
    const [goldSpent, setGoldSpent] = useState(0);
    const [level, setLevel] = useState(1);
    const [experience, setExperience] = useState(0);

    const {data: seasons} = useSWRGetSeasons();
    const {data: probability} = useSWRGetRerollProbability(seasonId || undefined, level);
    const {data: champions} = useSWRGetChampionList(seasonId || undefined);

    // ✅ 유닛 상태는 절대 push로 mutate 하지 말고, 초기값을 useState 인자로!
    const [units, setUnits] = useState<Unit[]>([
        {id: 1, star: 1, loc: 0, slot: 1},
        {id: 1, star: 1, loc: 1, slot: 10},
        {id: 2, star: 1, loc: 0, slot: 2},
        {id: 40, star: 2, loc: 0, slot: 5},
    ]);

    useEffect(() => {
        if (seasonId === 0 && seasons?.length) setSeasonId(seasons[0].id);
    }, [seasons, seasonId]);

    const p1 = probability?.level1 ?? 0;
    const p2 = probability?.level2 ?? 0;
    const p3 = probability?.level3 ?? 0;
    const p4 = probability?.level4 ?? 0;
    const p5 = probability?.level5 ?? 0;
    const p6: number | null = probability?.level6 ?? null;

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

    // ---------- 드래그&드롭 유틸 ----------
    const getIndexAt = (arr: Unit[], loc: 0 | 1, slot: number) =>
        arr.findIndex(u => u.loc === loc && u.slot === slot);

    const onDragStart = (e: React.DragEvent, loc: 0 | 1, slot: number) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({loc, slot}));
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // 반드시 있어야 drop 허용
        e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (e: React.DragEvent, destLoc: 0 | 1, destSlot: number) => {
        e.preventDefault();
        const txt = e.dataTransfer.getData("text/plain");
        if (!txt) return;
        const {loc: srcLoc, slot: srcSlot} = JSON.parse(txt) as { loc: 0 | 1; slot: number };

        // 같은 칸이면 무시
        if (srcLoc === destLoc && srcSlot === destSlot) return;

        setUnits(prev => {
            const next = [...prev];
            const si = getIndexAt(next, srcLoc, srcSlot);
            if (si < 0) return prev;

            const di = getIndexAt(next, destLoc, destSlot);

            if (di >= 0) {
                // 목적지에 이미 유닛 → 서로 위치 교환
                const s = next[si];
                const d = next[di];
                next[si] = {...s, loc: destLoc, slot: destSlot};
                next[di] = {...d, loc: srcLoc, slot: srcSlot};
            } else {
                // 빈 칸 → 단순 이동
                next[si] = {...next[si], loc: destLoc, slot: destSlot};
            }
            return next;
        });
    };

    // bench / board 배열로 변환
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

    // id → 메타(코스트/이미지 경로 등) 맵
    const champById = useMemo(() => {
        const m = new Map<number, any>();
        champions?.forEach((c: any) => m.set(c.id, c));
        return m;
    }, [champions]);

    // 코스트 → 테두리색 클래스 (벤치만)
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
                {/* 보드 */}
                <div className={style.board} role="grid" aria-label="배치 보드">
                    {[0, 1, 2, 3].map((row) => (
                        <div key={row} className={style.boardRow} role="row">
                            {Array.from({length: 7}).map((_, col) => {
                                const idx = row * 7 + col;
                                const cell = boardCells[idx];
                                const meta = cell ? champById.get(cell.id) : null;

                                return (
                                    <div
                                        key={idx}
                                        className={style.hexCell}
                                        onDragOver={onDragOver}
                                        onDrop={(e) => onDrop(e, 1, idx)}
                                        draggable={!!cell}
                                        onDragStart={cell ? (e) => onDragStart(e, 1, idx) : undefined}
                                    >
                                        <div className={style.hexInner}>
                                            {meta && (
                                                <img
                                                    className={style.unitImgBoard}
                                                    src={meta.squarePath}
                                                    alt=""
                                                    draggable={false}
                                                />
                                            )}
                                        </div>
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
                        return (
                            <div
                                key={i}
                                className={`${style.benchSlot} ${costCls}`}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, 0, i)}
                                draggable={!!cell}
                                onDragStart={cell ? (e) => onDragStart(e, 0, i) : undefined}
                            >
                                {meta && (
                                    <img
                                        className={style.unitImgBench}
                                        src={meta.mobilePath}
                                        alt=""
                                        draggable={false}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={style.refresh}>
                <div className={style.tiers}>
                    <span className={`${style.chip} ${style.gray}`}><img src={goldIcon} alt="골드"/>1Lv {p1}%</span>
                    <span className={`${style.chip} ${style.green}`}><img src={goldIcon} alt="골드"/>2Lv {p2}%</span>
                    <span className={`${style.chip} ${style.blue}`}><img src={goldIcon} alt="골드"/>3Lv {p3}%</span>
                    <span className={`${style.chip} ${style.navy}`}><img src={goldIcon} alt="골드"/>4Lv {p4}%</span>
                    <span className={`${style.chip} ${style.gold}`}><img src={goldIcon} alt="골드"/>5Lv {p5}%</span>
                    {p6 != null && (<span className={`${style.chip} ${style.orange}`}><img src={goldIcon}
                                                                                           alt="골드"/>6Lv {p6}%</span>)}
                </div>
                <div className={style.shop}></div>
            </div>

            <div className={style.action}>
                <button onClick={handleBuyXp} disabled={isMaxLevel}>경험치 구매</button>
                <button onClick={handleRefreshShop}>상점 새로고침</button>
            </div>
        </div>
    );
};
