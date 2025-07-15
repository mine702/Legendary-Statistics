import style from "./FreeBoard.module.scss";
import {useNavigate, useSearchParams} from "react-router";
import {useSWRBoardList} from "../../../server/server.ts";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";
import {BoardListItem} from "../../../component/board/BoardListItem.tsx";

export const FreeBoard = () => {
  const navigate = useNavigate();

  const searchParamsList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const {data} = useSWRBoardList(page, "free");

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`);
  };

  return (
    <div className={style.root}>
      <div className={style.controls}>
        <h1>자유게시판</h1>
      </div>
      {data?.total === 0 && <div className={style.noInquiry}>게시판 글이 없습니다.</div>}
      {data?.items.map((item, index) =>
        <BoardListItem onClickItem={onClickItem} item={item} key={index}/>
      )}
      <ListPager page={page} pageItem={data} onChangePage={setPage}/>
    </div>
  );
};
