import style from "./Home.module.scss";
import mainImg from "../../assets/img/main_logo.png";
import {useSWRGetNewLegendLast, useSWRGetTreasureLastList, useSWRRankingList} from "../../server/server.ts";
import {RankingCard} from "../ranking/card/RankingCard.tsx";
import {useNavigate} from "react-router";
import {useState} from "react";
import {showToastOnError} from "../../util/errorParser.ts";
import axios from "axios";
import {ApiResponse} from "../../server/dto/format.ts";
import {GetLegendListRes} from "../../server/dto/legend.ts";
import {toast} from "react-toastify";
import {SimulatorLegendCard} from "../simulator/card/SimulatorLegendCard.tsx";
import KakaoSideAds from "../../component/ads/KakaoSideAds.tsx";

export const Home = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const {data: ranking} = useSWRRankingList(0, 3);
  const {data: legend} = useSWRGetNewLegendLast();
  const {data: treasure} = useSWRGetTreasureLastList();

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

  const contentReady =
    Boolean(treasure && treasure.length > 0) ||
    Boolean(ranking && ranking.items && ranking.items.length > 0) ||
    Boolean(legend && legend.videoUrl);

  const enableAds =
    contentReady;

  return (
    <div className={style.root}>
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

      <div className={style.simulatorContainer}>
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

      <div className={style.rankingContainer} onClick={() => navigate("/ranking")}>
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

      {/* PC 사이드 배너 */}
      <KakaoSideAds
        leftUnit="DAN-J1QA72OWURoG5jRw"
        rightUnit="DAN-J1QA72OWURoG5jRw"
        width={160}
        height={600}
        top={120}
        enabled={enableAds}
        test={true}
      />
    </div>
  );
};
