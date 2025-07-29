import style from "./Community.module.scss"
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {NoticeBoard} from "./NoticeBoard/NoticeBoard.tsx";
import {Redirect} from "../../component/Redirect.tsx";
import {FreeBoard} from "./FreeBoard/FreeBoard.tsx";
import {WriteBoard} from "./WriteBoard/WriteBoard.tsx";
import {BoardDetail} from "./BoardDetail/BoardDetail.tsx";
import {MyBoardList} from "./MyBoardList/MyBoardList.tsx";

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
                    onClick={() => navigate("/community/notice")}>공지사항
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("freeboard")}`}
                    onClick={() => navigate("/community/freeboard")}>자유게시판
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("write")}`}
                    onClick={() => navigate("/community/write")}>글 작성
            </button>
            <button className={`custom ${style.menuItem} ${getMatchPathStyle("/list")}`}
                    onClick={() => navigate("/community/my-list")}>작성 기록
            </button>
          </div>
          <div className={style.contentArea}>
            <Routes>
              <Route path="/notice" element={<NoticeBoard/>}/>
              <Route path="/freeboard" element={<FreeBoard/>}/>
              <Route path="/write" element={<WriteBoard/>}/>
              <Route path="/detail/:id" element={<BoardDetail/>}/>
              <Route path="/edit/:id" element={<WriteBoard/>}/>
              <Route path="/my-list" element={<MyBoardList/>}/>
              <Route path="*" element={<Redirect path="notice"/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
