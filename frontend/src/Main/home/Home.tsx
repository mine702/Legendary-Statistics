import style from "./Home.module.scss";
import mainImg from "../../assets/img/main_logo.png";
import {
  useSWRGetLegendLast,
  useSWRGetNewLegendLast,
  useSWRGetTreasureLastList,
  useSWRRankingList
} from "../../server/server.ts";
import {RankingCard} from "../ranking/card/RankingCard.tsx";
import {useNavigate} from "react-router";
import {useState} from "react";
import {showToastOnError} from "../../util/errorParser.ts";
import axios from "axios";
import {ApiResponse} from "../../server/dto/format.ts";
import {GetLegendListRes} from "../../server/dto/legend.ts";
import {toast} from "react-toastify";
import {SimulatorLegendCard} from "../simulator/card/SimulatorLegendCard.tsx";
import {LegendCard} from "../list/card/LegendCard.tsx";
import AdsenseExample from "../adsense/AdsenseExample.tsx";

export const Home = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const {data: ranking} = useSWRRankingList(0, 3);
  const {data: legend} = useSWRGetNewLegendLast();
  const {data: treasure} = useSWRGetTreasureLastList();
  const {data: lastLegend} = useSWRGetLegendLast();

  const handleSearch = showToastOnError(async () => {
    if (!searchTerm.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }
    await axios.get<ApiResponse<GetLegendListRes>>(`legend/name/${searchTerm}`)
      .then((res) => {
        navigate('/list', {state: {kindId: res.data?.data?.kindId}});
      })
  });

  const handleCardClick = (id: number) => {
    navigate(`/simulator/${id}`);
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <img src={mainImg as string} alt="main" className={style.mainImg}/>
        <div className={style.announcement}>
          <p>
            TFT META 는 라이엇 게임즈의 지식재산 이용 정책에 따라
          </p>
          <p>
            라이엇 게임즈 소유의 자산을 이용하여 제작되었습니다.
          </p>
          <p>
            라이엇 게임즈는 이 프로젝트를 지지하거나 후원하지 않습니다.
          </p>
        </div>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="꼬마 전설이 검색"
            className={style.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button className={style.searchButton}
                  onClick={handleSearch}>
            검색
          </button>
        </div>
        <div className={style.adContainer}>
          <AdsenseExample/>
        </div>
        <div className={style.simulatorContainer}>
          <div className={style.description}>
            원하는 꼬마 전설이를 뽑을 확률을 직접 확인하고 당신의 운을 확인해 보세요!
          </div>
          <div className={style.simulatorContent}>
            {!treasure ? (
              <div>시뮬레이터 전설 정보를 불러오는 중입니다...</div>
            ) : (
              treasure.map((item) => (
                <SimulatorLegendCard
                  key={item.name}
                  item={item}
                  onClick={() => handleCardClick(item.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className={style.rankingContainer} onClick={() => navigate("/ranking")}>
          <div className={style.description}>
            좋아하는 꼬마 전설이의 랭킹을 확인해보세요!
          </div>
          <div className={style.rankingContent}>
            {ranking?.items ? (
              <>
                <RankingCard
                  rank={2}
                  image={ranking.items[1].path}
                  name={ranking.items[1].name}
                />
                <RankingCard
                  rank={1}
                  image={ranking.items[0].path}
                  name={ranking.items[0].name}
                />
                <RankingCard
                  rank={3}
                  image={ranking.items[2].path}
                  name={ranking.items[2].name}
                />
              </>
            ) : (
              <div className={style.noRanking}>랭킹 정보가 없습니다.</div>
            )}
          </div>
        </div>

        <div className={style.legendContainer}>
          <div className={style.description}>
            새롭게 추가된 꼬마 전설이 리스트 입니다!
          </div>
          <div className={style.legendContent}>
            {!lastLegend ? (
              <div>꼬마 전설이 정보를 불러오는 중입니다...</div>
            ) : (
              lastLegend.map((item) => (
                <LegendCard
                  key={item.name}
                  legend={item}
                />
              ))
            )}
          </div>
        </div>

        <div className={style.videoContainer}>
          {legend ? (
            <div className={style.videoWrapper}>
              <iframe
                src={legend.videoUrl.replace("watch?v=", "embed/")}
                title="전설 영상"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div>최신 전설 정보를 불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  );
};
