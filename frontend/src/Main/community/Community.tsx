import style from "./Community.module.scss"
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {NoticeBoard} from "./NoticeBoard/NoticeBoard.tsx";

export const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const getMatchPathStyle = (includeStr: string) => {
    return location.pathname.includes(includeStr) ? style.selected : "";
  }

  return (
    <div className={style.root}>
      <div className={style.reactiveContainer}>
        <div className={style.containerInbox}>
          <div className={style.leftNavigator}>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("notice")}`}
                    onClick={() => navigate("notice")}>공지사항
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("new-legend")}`}
                    onClick={() => navigate("new-legend")}>신규 전설이
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("freeboard")}`}
                    onClick={() => navigate("freeboard")}>자유게시판
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("write")}`}
                    onClick={() => navigate("write")}>글 작성
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("/list")}`}
                    onClick={() => navigate("list")}>작성 기록
            </button>
          </div>
          <div className={style.contentArea}>
            <Routes>
              <Route path="/notice" element={<NoticeBoard/>}/>
              {/**
               <Route path="/freeboard" element={<FreeBoard/>}/>
               <Route path="/write" element={<WriteBoard/>}/>
               <Route path="/edit/:id" element={<WriteBoard/>}/>
               <Route path="/list" element={<MyBoardList/>}/>
               <Route path="/detail/:id" element={<BoardDetail/>}/>
               **/}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
