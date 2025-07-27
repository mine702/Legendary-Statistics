import style from "./Ranking.module.scss"
import rankingLogo from "../../assets/img/ranking_logo.png";
import {RankingResult} from "./result/RankingResult.tsx";
import {useSWRGetRateList, useSWRRankingList} from "../../server/server.ts";
import {useSearchParamState} from "../../util/hooks/useSearchParamState.ts";
import {useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {KindList} from "../../component/kind/KindList.tsx";
import {ListPager} from "../../component/ListPager.tsx";

export const Ranking = () => {
  const searchParamsList = useSearchParams();

  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const [kind, setKind] = useSearchParamState<number | undefined>(searchParamsList, "kind", undefined);
  const [limit, setLimit] = useSearchParamState<boolean | undefined>(searchParamsList, "limit", undefined);
  const [rate, setRate] = useSearchParamState<number | undefined>(searchParamsList, "rate", undefined);
  const [year, setYear] = useSearchParamState<number | undefined>(searchParamsList, "year", undefined);
  const [keyword, setKeyword] = useSearchParamState<string | undefined>(searchParamsList, "keyword", undefined);

  const {data: rateList} = useSWRGetRateList();
  const {data} = useSWRRankingList(page, kind, limit, rate, year, keyword);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [showKindList, setShowKindList] = useState(false);

  const onClickAll = () => {
    setShowKindList(false);
    setKind(undefined);
    setLimit(undefined);
    setRate(undefined);
    setYear(undefined);
    setKeyword(undefined);
    setPage(0);
  }

  const onClickKind = () => {
    setShowKindList(!showKindList)
    setKind(undefined);
    setLimit(undefined);
    setRate(undefined);
    setYear(undefined);
    setKeyword(undefined);
  };

  const onClickLimit = () => {
    setShowKindList(false);
    setKind(undefined);
    setLimit(true);
    setRate(undefined);
    setYear(undefined);
    setKeyword(undefined);
    setPage(0);
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = 2025; y <= currentYear; y++) {
      years.push(y);
    }
    return years;
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = Number(e.target.value);
    setYear(selectedYear);
    setPage(0); // 연도 변경 시 페이지 초기화
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRate = Number(e.target.value);
    setRate(selectedRate);
    setShowKindList(false);
    setKind(undefined);
    setLimit(false);
    setYear(undefined);
    setKeyword(undefined);
    setPage(0);
  }

  return (
    <div className={style.root}>
      <div className={style.container}>
        {/* 헤더 이미지 */}
        <div className={style.headerWrapper}>
          <img src={rankingLogo} alt="로고"/>
        </div>
        <div className={style.selectContainer}>
          <button onClick={onClickAll}>전체</button>
          <button onClick={onClickKind}>종류</button>
          <button onClick={onClickLimit}>미니 전설이</button>
          <select value={rate ?? ""} onChange={handleRateChange}>
            <option value="">등급 선택</option>
            {rateList
              ?.filter((rate) => rate.name !== "화폐")
              .map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.name}
                </option>
              ))}
          </select>
          <select value={year ?? ""} onChange={handleYearChange}>
            <option value="">연도 선택</option>
            {getYearOptions().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="꼬마 전설이 입력..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
  )
}
