import style from "./NoticeBoard.module.scss";
import {useNavigate, useSearchParams} from "react-router";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";
import {useSWRBoardList} from "../../../server/server.ts";
import {BoardListItem} from "../../../component/board/BoardListItem.tsx";

export const NoticeBoard = () => {
  const navigate = useNavigate();

  const searchParamsList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const {data} = useSWRBoardList(page, "notice");

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`);
  };

  return (
    <div className={style.root}>
      <div className={style.controls}>
        <h1>{"공지사항"}</h1>
      </div>
      {data?.total === 0 && <div className={style.noInquiry}>공지사항이 없습니다.</div>}
      {data?.items.map((item, index) =>
        <BoardListItem onClickItem={onClickItem} item={item} key={index}/>
      )}
      <ListPager page={page} pageItem={data} onChangePage={setPage}/>
    </div>
  );
};
