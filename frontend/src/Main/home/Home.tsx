import style from "./Home.module.scss";
import mainImg from "../../assets/img/main_logo.png";

export const Home = () => {
  return (
    <div className={style.root}>
      {/* 🌟 가운데 정렬된 메인 이미지 */}
      <img src={mainImg as string} alt="main" className={style.mainImg}/>

      {/* 🌟 검색 창 + 검색 버튼 */}
      <div className={style.searchContainer}>
        <input type="text" placeholder="꼬마 전설이 검색" className={style.searchBar}/>
        <button className={style.searchButton}>검색</button>
      </div>
      {/* 🌟 첫 번째 공간 */}
      <div className={style.sectionOne}>
        <h2>첫 번째 공간</h2>
      </div>

      {/* 🌟 두 번째 공간 */}
      <div className={style.sectionTwo}>
        <h2>두 번째 공간</h2>
      </div>

      {/* 🌟 세 번째 공간 (3개 세로로 배치된 div) */}
      <div className={style.sectionThree}>
        <div className={style.innerDiv}>세 번째 공간 - 첫 번째</div>
        <div className={style.innerDiv}>세 번째 공간 - 두 번째</div>
        <div className={style.innerDiv}>세 번째 공간 - 세 번째</div>
      </div>
    </div>
  );
};
