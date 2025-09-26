import {useCallback, useEffect, useMemo, useState,} from "react";
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
import {toast} from "react-toastify";

// loc: 0 = bench, 1 = board
type Unit = {
    id: number;
    star: 1 | 2 | 3;
    loc: 0 | 1;
    slot: number;
};
type CellPos = { loc: 0 | 1; slot: number };
type ShopItem = { id: number; cost: number };

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

const getSellPrice = (cost: number, star: 1 | 2 | 3): number => {
    const table: Record<number, { 1: number; 2: number; 3: number }> = {
        1: {1: 1, 2: 3, 3: 9},
        2: {1: 2, 2: 5, 3: 17},
        3: {1: 3, 2: 8, 3: 26},
        4: {1: 4, 2: 11, 3: 35},
        5: {1: 5, 2: 14, 3: 44},
    };
    const row = table[cost as 1 | 2 | 3 | 4 | 5];
    if (!row) return 0; // (선택) 6코 등은 0으로
    return row[star];
};

export const RerollSimulator = () => {
    // ── state
    const [seasonId, setSeasonId] = useState<number>(0);
    const [goldSpent, setGoldSpent] = useState(0);
    const [level, setLevel] = useState(1);
    const [experience, setExperience] = useState(0);
    const [selected, setSelected] = useState<CellPos | null>(null);
    const [isSelling, setIsSelling] = useState(false);

    const SHOP_SIZE = 5;
    const [shop, setShop] = useState<ShopItem[]>([]);

    const {data: seasons} = useSWRGetSeasons();
    const {data: probability} = useSWRGetRerollProbability(seasonId || undefined, level);
    const {data: champions} = useSWRGetChampionList(seasonId || undefined);
    const {data: synergy} = useSWRGetSynergyList(seasonId || undefined);

    const [units, setUnits] = useState<Unit[]>([]);

    const boardCount = useBoardCount(units);
    const boardCap = boardCapByLevel(level);
    const isBoardFull = boardCount >= boardCap;

    useEffect(() => {
        if (seasonId === 0 && seasons?.length) setSeasonId(seasons[0].id);
    }, [seasons, seasonId]);

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

    const getIndexAt = (arr: Unit[], loc: 0 | 1, slot: number) =>
        arr.findIndex(u => u.loc === loc && u.slot === slot);
    const getUnitAt = (arr: Unit[], loc: 0 | 1, slot: number) =>
        arr.find(u => u.loc === loc && u.slot === slot) ?? null;

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

    const champById = useMemo(() => {
        const m = new Map<number, any>();
        champions?.forEach((c: any) => m.set(c.id, c));
        return m;
    }, [champions]);

    // ── 확률
    const p1 = probability?.level1 ?? 0;
    const p2 = probability?.level2 ?? 0;
    const p3 = probability?.level3 ?? 0;
    const p4 = probability?.level4 ?? 0;
    const p5 = probability?.level5 ?? 0;
    const p6: number | null = probability?.level6 ?? null;

    const synergyById = useMemo(() => {
        const m = new Map<number, { id: number; name: string; desc: string; path: string }>();
        synergy?.forEach((s: any) => m.set(s.id, s));
        return m;
    }, [synergy]);

    const activeSynergies = useMemo(() => {
        if (!champions) return [];
        const ids = new Set<number>();
        for (const u of units) {
            if (u.loc !== 1) continue;
            const ch = champions.find((c: any) => c.id === u.id);
            ch?.synergyList?.forEach((sid: number) => ids.add(sid));
        }
        return Array.from(ids)
            .map((id) => synergyById.get(id))
            .filter(Boolean) as { id: number; name: string; desc: string; path: string }[];
    }, [units, champions, synergyById]);

    // 비용별 챔피언 목록 캐시
    const champsByCost = useMemo(() => {
        const map = new Map<number, any[]>();
        if (champions) {
            for (const c of champions) {
                if (!map.has(c.cost)) map.set(c.cost, []);
                map.get(c.cost)!.push(c);
            }
        }
        return map;
    }, [champions]);

    // 확률로 코스트 1개 뽑기
    const rollOneCost = () => {
        const pool: { cost: number; p: number }[] = [
            {cost: 1, p: p1},
            {cost: 2, p: p2},
            {cost: 3, p: p3},
            {cost: 4, p: p4},
            {cost: 5, p: p5},
        ];
        if (p6 != null) pool.push({cost: 6, p: p6});
        // 해당 코스트에 챔피언이 없으면 확률 0으로
        const filtered = pool.map(x => ({
            ...x,
            p: (champsByCost.get(x.cost)?.length ?? 0) > 0 ? x.p : 0
        }));
        const sum = filtered.reduce((a, b) => a + b.p, 0);
        if (sum <= 0) return 1; // fallback
        let r = Math.random() * sum;
        for (const it of filtered) {
            if ((r -= it.p) <= 0) return it.cost;
        }
        return filtered[filtered.length - 1].cost;
    };

    const getOwnedInfo = (id: number) => {
        let copies = 0;
        let maxStar: 0 | 1 | 2 | 3 = 0;

        for (const u of units) {
            if (u.id !== id) continue;
            copies++;
            if (u.star > maxStar) {
                maxStar = u.star;
            }
        }
        return {copies, maxStar};
    };

    const pickWeighted = <T, >(items: T[], weightOf: (it: T) => number): T | null => {
        const weights = items.map(weightOf);
        const sum = weights.reduce((a, b) => a + b, 0);
        if (sum <= 0) return null;
        let r = Math.random() * sum;
        for (let i = 0; i < items.length; i++) {
            r -= weights[i];
            if (r <= 0) return items[i];
        }
        return items[items.length - 1];
    };

    const rollOneItem = (): ShopItem | null => {
        const cost = rollOneCost();
        const list = champsByCost.get(cost);
        if (!list || list.length === 0) return null;

        const chosen = pickWeighted(list, (ch) => {
            const {copies, maxStar} = getOwnedInfo(ch.id);
            if (maxStar >= 3) return 0;      // 3성 있으면 절대 안 뜸
            if (maxStar === 2) return 0.15;  // 2성 보유 디버프
            if (copies >= 2) return 0.4;
            if (copies >= 1) return 0.7;
            return 1.0;
        });

        if (!chosen) return null;
        return {id: chosen.id, cost: chosen.cost};
    };

    const rollShop = () => {
        const items: ShopItem[] = [];
        for (let i = 0; i < SHOP_SIZE; i++) {
            const it = rollOneItem();
            if (it) items.push(it);
        }
        setShop(items);
    };

    // 첫 빈 벤치칸
    const findFirstEmptyBench = (arr: Unit[]) => {
        for (let i = 0; i < 10; i++) {
            if (!arr.some(u => u.loc === 0 && u.slot === i)) return i;
        }
        return -1;
    };

    // 합성(3장 업그레이드, 체인 처리)
    const tryMergeChain = (arr: Unit[], id: number, startStar: 1 | 2): Unit[] => {
        // 같은 id & 같은 star가 3개 이상이면 → 하나를 star+1로, 나머지 2개 제거
        // 이게 또 3개가 되면 체인으로 계속
        let star: 1 | 2 = startStar;
        while (true) {
            const idxs = arr
                .map((u, i) => ({u, i}))
                .filter(({u}) => u.id === id && u.star === star)
                .map(({i}) => i);

            if (idxs.length < 3) break;

            // 승격시 기준으로 사용할 유닛(첫번째)
            const keepIdx = idxs[0];
            // 제거할 두 개(뒤의 2개)
            const removeIdxA = idxs[1];
            const removeIdxB = idxs[2];

            // 제거 인덱스가 keep보다 뒤에서 먼저 지워지도록 정렬
            const del = [removeIdxA, removeIdxB].sort((a, b) => b - a);
            const base = arr[keepIdx];

            // 2개 제거
            for (const d of del) arr.splice(d, 1);

            // keep을 승격
            const upgraded: 2 | 3 = (base.star + 1) as 2 | 3;
            arr[keepIdx] = {...base, star: upgraded};

            // 다음 루프에서 더 높은 별 체인 검사
            if (upgraded === 3) break; // 최고성
            star = 2; // 1→2로 올렸으면 이제 2성을 기준으로 또 검사
        }
        return arr;
    };

    // 유닛 구매(벤치 우선) + 합성
    const buyFromShop = (slotIdx: number) => {
        const item = shop[slotIdx];
        if (!item) return;

        setUnits(prev => {
            const next = [...prev];

            const oneStarIdx = next
                .map((u, i) => ({u, i}))
                .filter(({u}) => u.id === item.id && u.star === 1)
                .map(({i}) => i);

            const empty = findFirstEmptyBench(next);

            if (empty === -1 && oneStarIdx.length >= 2) {
                const keepIdx = oneStarIdx[0];
                const removeIdx = oneStarIdx[1];

                const del = [removeIdx].sort((a, b) => b - a);
                for (const d of del) next.splice(d, 1);

                next[keepIdx] = {...next[keepIdx], star: 2};

                tryMergeChain(next, item.id, 2);

                setGoldSpent(g => g + item.cost);
                setShop(s => s.map((it, i) => (i === slotIdx ? (null as any) : it)));

                return next;
            }

            if (empty !== -1) {
                next.push({id: item.id, star: 1, loc: 0, slot: empty});
                tryMergeChain(next, item.id, 1);

                setGoldSpent(g => g + item.cost);
                setShop(s => s.map((it, i) => (i === slotIdx ? (null as any) : it)));
                return next;
            }

            toast.error("배치 가능한 슬롯이 없습니다!", {autoClose: 2});
            return prev;
        });
    };

    // 경험치/리롤 버튼
    const handleBuyXp = useCallback(() => {
        if (isMaxLevel) return;
        setExperience(v => Math.min(v + 4, THRESHOLDS[THRESHOLDS.length - 1]));
        setGoldSpent(g => g + 4);
    }, [isMaxLevel]);

    const handleRefreshShop = useCallback(() => {
        setGoldSpent(g => g + 2);
        rollShop();
    }, [rollShop]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;

            const target = e.target as HTMLElement | null;
            const tag = target?.tagName;
            const editable = target?.isContentEditable;
            // 인풋류 포커스 시 단축키 비활성
            if (editable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const key = e.key.toLowerCase();
            if (key === 'f') {
                e.preventDefault();
                handleBuyXp();
            } else if (key === 'd') {
                e.preventDefault();
                handleRefreshShop();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleBuyXp, handleRefreshShop]);

    useEffect(() => {
        if (seasonId) rollShop();
    }, [seasonId, champions]);

    // 클릭 이동/스왑 (보드 수 제한 포함)
    const handleCellClick = (destLoc: 0 | 1, destSlot: number) => {
        if (isSelling) {
            sellAt(destLoc, destSlot);
            return;
        }

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

    const sellAt = (loc: 0 | 1, slot: number) => {
        setUnits(prev => {
            const idx = prev.findIndex(u => u.loc === loc && u.slot === slot);
            if (idx < 0) return prev;

            const target = prev[idx];
            const meta = champById.get(target.id);
            if (!meta) return prev;

            const refund = getSellPrice(meta.cost, target.star);
            if (refund <= 0) return prev;

            const next = [...prev];
            next.splice(idx, 1);

            // 환급은 goldSpent에서 마이너스(사용 골드 감소)
            setGoldSpent(g => Math.max(0, g - refund));
            return next;
        });
    };

    return (
        <div className={`${style.simulator} ${isSelling ? style.selling : ""}`}>
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
                <button
                    type="button"
                    className={`${style.saleBtn} ${isSelling ? style.cancel : style.sell}`}
                    onClick={() => setIsSelling(v => !v)}
                    aria-pressed={isSelling}
                >
                    {isSelling ? "취소" : "판매"}
                </button>
            </div>

            {/* 하단: 확률 + 상점 */}
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

                {/* 상점 목록 */}
                <div className={style.shop} aria-label="상점">
                    {shop.map((it, i) => {
                        const meta = it ? champById.get(it.id) : null;
                        if (!meta) return (
                            <div key={i} className={`${style.shopCard} ${style.empty}`}/>
                        );
                        return (
                            <button
                                key={i}
                                type="button"
                                className={`${style.shopCard} ${costClass(meta.cost)}`}
                                onClick={() => buyFromShop(i)}
                                title={`${meta.name} 구매 (${meta.cost})`}
                            >
                                <img className={style.shopImg} src={meta.path} alt=""/>
                                <div className={style.shopInfo}>
                                    <span className={style.shopName}>{meta.name}</span>
                                    <span className={style.shopCost}><img src={goldIcon} alt="골드"/>{meta.cost}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={style.action}>
                <button onClick={handleBuyXp} disabled={isMaxLevel}>경험치 구매 (F)</button>
                <button onClick={handleRefreshShop}>상점 새로고침 (D)</button>
            </div>
        </div>
    );
};
