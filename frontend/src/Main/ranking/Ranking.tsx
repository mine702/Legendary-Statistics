import style from "./Ranking.module.scss"
import rankingLogo from "../../assets/img/ranking_logo.png";
import {RankingResult} from "./result/RankingResult.tsx";
import {useSWRGetRateList, useSWRRankingList} from "../../server/server.ts";
import {useSearchParamState} from "../../util/hooks/useSearchParamState.ts";
import {useSearchParams} from "react-router";
import {useState} from "react";
import {KindList} from "../../component/kind/KindList.tsx";
import {ListPager} from "../../component/ListPager.tsx";
import {AdsenseSide} from "../adsense/AdsenseSide.tsx";

export const Ranking = () => {
  const searchParamsList = useSearchParams();

  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const [kind, setKind] = useSearchParamState<number | undefined>(searchParamsList, "kind", undefined);
  const [limit, setLimit] = useSearchParamState<boolean | undefined>(searchParamsList, "limit", undefined);
  const [rate, setRate] = useSearchParamState<number | undefined>(searchParamsList, "rate", undefined);
  const [year, setYear] = useSearchParamState<number | undefined>(searchParamsList, "year", undefined);
  const [keyword, setKeyword] = useSearchParamState<string | undefined>(searchParamsList, "keyword", undefined);

  const {data: rateList} = useSWRGetRateList();
  const {data} = useSWRRankingList(page, 30, kind, limit, rate, year, keyword);

  const [showKindList, setShowKindList] = useState(false);

  const resetFilters = ({
                          kind = undefined,
                          limit = undefined,
                          rate = undefined,
                          year = undefined,
                          keyword = undefined,
                        }: {
    kind?: number | undefined;
    limit?: boolean | undefined;
    rate?: number | undefined;
    year?: number | undefined;
    keyword?: string | undefined;
  }) => {
    setShowKindList(false);
    setKind(kind);
    setLimit(limit);
    setRate(rate);
    setYear(year);
    setKeyword(keyword);
    setPage(0);
  };

  const onClickAll = () => {
    resetFilters({});
  };

  const onClickKind = () => {
    resetFilters({});
    setShowKindList((prev) => !prev);
  };

  const onClickLimit = () => {
    resetFilters({limit: true});
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = Number(e.target.value);
    setYear(selectedYear);
    setPage(0);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRate = Number(e.target.value);
    resetFilters({rate: selectedRate});
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setKeyword(value === "" ? undefined : value);
    setPage(0);
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = 2025; y <= currentYear; y++) {
      years.push(y);
    }
    return years;
  };

  return (
    <div className={style.root}>
      <div className={style.layout}>
        <aside className={style.left}>
          <AdsenseSide
            placement="left"
            slotLarge="6054446808"
            slotSmall="2131611729"
          />
        </aside>

        <main className={style.mid}>
          <div className={style.container}>
            {/* 헤더 이미지 */}
            <div className={style.headerWrapper}>
              <img src={rankingLogo} alt="로고"/>
            </div>
            <div className={style.content}>
              <div className={style.selectContainer}>
                <button onClick={onClickAll}>전체</button>
                <button onClick={onClickKind}>종류</button>
                <button onClick={onClickLimit}>미니 전설이</button>
                <select value={rate ?? ""} onChange={handleRateChange}>
                  <option value="">등급</option>
                  {rateList
                    ?.filter((rate) => rate.name !== "화폐")
                    .map((rate) => (
                      <option key={rate.id} value={rate.id}>
                        {rate.name}
                      </option>
                    ))}
                </select>
                <select value={year ?? ""} onChange={handleYearChange}>
                  <option value="">연도</option>
                  {getYearOptions().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="꼬마 전설이 입력..."
                  value={keyword ?? ""}
                  onChange={handleKeywordChange}
                />
              </div>

              {showKindList && (
                <div className={style.filterContainer}>
                  <KindList selectedId={kind} setSelectedId={setKind}/>
                </div>
              )}

              <div className={style.listContainer}>
                <RankingResult value={data?.items} start={data?.page} size={data?.size}/>
              </div>
              <ListPager page={page} pageItem={data} onChangePage={setPage}/>
            </div>
          </div>
        </main>
        <aside className={style.right}>
          <AdsenseSide
            placement="right"
            slotLarge="4738289264"
            slotSmall="4933444977"
          />
        </aside>
      </div>
    </div>
  )
}

