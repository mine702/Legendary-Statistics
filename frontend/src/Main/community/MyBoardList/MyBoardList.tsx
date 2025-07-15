import style from "./MyBoardList.module.scss"
import {useSWRGetMyBoardList} from "../../../server/server.ts";
import {useNavigate, useSearchParams} from "react-router";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";
import {BoardListItem} from "../../../component/board/BoardListItem.tsx";

export const MyBoardList = () => {
  const navigate = useNavigate();
  const searchParamList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamList, "page", 0);
  const {data} = useSWRGetMyBoardList(page);

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`)
  }

  return <div className={style.root}>
    <h1 style={{marginBottom: "20px"}}>게시글 작성 기록</h1>
    {data?.total === 0 && <div className={style.noInquiry}>작성 기록이 없습니다.</div>}
    {data?.items.map((item, index) =>
      <BoardListItem onClickItem={onClickItem} item={item} key={index}/>
    )}
    <ListPager page={page} pageItem={data} onChangePage={setPage}/>
  </div>
}
