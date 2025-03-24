import style from "./SimulatorResult.module.scss";
import axios from "axios";
import {showToastOnError} from "../../../util/errorParser.ts";
import {useEffect, useRef, useState} from "react";
import {GetSimulatorRes} from "../../../server/dto/treasure.ts";
import image from "../../../assets/img/강도깨비.png";
import {useSWRGetRateList} from "../../../server/server.ts";

interface Props {
  id?: string;
  name?: string;
}

export const SimulatorResult = (props: Props) => {
  const {data: rateData} = useSWRGetRateList();
  const [results, setResults] = useState<GetSimulatorRes[]>([]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [results]);

  const addResultsSequentially = (items: GetSimulatorRes[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= items.length) {
        clearInterval(interval);
        return;
      }
      const item = items[i];
      if (item)
        setResults((prev) => [...prev, item]);
      i++;
    }, 100);
  };

  const onDrawClick = showToastOnError(async () => {
    const res = await axios.get(`/treasure/simulator/${props.id}`);
    const newResults: GetSimulatorRes[] = res.data.data || [];
    setResults([]);
    addResultsSequentially(newResults);
  });

  const onGuaranteeClick = showToastOnError(async () => {
    if (!props.name) return;
    setResults([]); // 결과 초기화
    let found = false;
    const tryDraw = async () => {
      const res = await axios.get(`/treasure/simulator/${props.id}`);
      const drawResults: GetSimulatorRes[] = res.data.data || [];
      let i = 0;
      const interval = setInterval(() => {
        if (i >= drawResults.length) {
          clearInterval(interval);
          if (!found) {
            setTimeout(() => {
              tryDraw();
            }, 200);
          }
          return;
        }
        const current = drawResults[i];
        setResults((prev) => [...prev, current]);
        if (current.name === props.name) {
          found = true;
          clearInterval(interval);
        }
        i++;
      }, 100);
    };
    await tryDraw();
  });

  const countByRate: Record<number, number> = {};

  // @ts-ignore
  for (let i = 0; i <= rateData?.length; i++) countByRate[i] = 0;

  results.forEach((item) => {
    const rate = item.rate ?? 0;
    countByRate[rate]++;
  });

  return (
    <div className={style.resultWrapper}>
      <div className={style.header}>
        <h2 className={style.title}>시뮬레이션 결과</h2>
        <div className={style.buttonGroup}>
          <button onClick={onDrawClick}>10회 뽑기</button>
          <button onClick={onGuaranteeClick}>확정 뽑기</button>
        </div>
      </div>
      <div className={style.resultBox}>
        {results.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`${style.card} ${style['rate' + (item.rate ?? 0)]}`}
          >
            <img src={image} alt={item.name ?? "이름 없음"} className={style.image}/>
            <div className={style.name}>{item.name ?? "이름 없음"}</div>
          </div>

        ))}
        <div ref={scrollAnchorRef}></div>
      </div>
      <div className={style.expectedBox}>
        <p>총 뽑기 횟수: {results.length}회</p>

        <div className={style.rateStats}>
          {rateData?.map((rate) => {
            const count = countByRate[rate.id] ?? 0;
            return (
              <span key={rate.id} className={style[rate.name]}>
                {rate.name}: {count}개{" "}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
