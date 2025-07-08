import style from "./NoticeBoard.module.scss";
import {useNavigate, useSearchParams} from "react-router";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";
import {useSWRMyBoardList} from "../../../server/server.ts";
import {useEffect} from "react";

export const NoticeBoard = () => {
  const navigate = useNavigate();

  const searchParamsList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const {data} = useSWRMyBoardList(page, "notice");

  useEffect(() => {
    console.log(data)
  }, [data]);

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`);
  };

  return (
    <div className={style.root}>
      <div className={style.controls}>
        <h1>{"공지사항"}</h1>
      </div>
      {data?.items.length === 0 && <div className={style.noInquiry}>문의 기록이 없습니다.</div>}
      <ListPager page={page} pageItem={data} onChangePage={setPage}/>
    </div>
  );
};
