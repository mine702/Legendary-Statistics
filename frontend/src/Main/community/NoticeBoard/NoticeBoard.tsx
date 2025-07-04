import style from "./NoticeBoard.module.scss";
import {useNavigate, useSearchParams} from "react-router";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";

export const NoticeBoard = () => {
  const navigate = useNavigate();

  const searchParamsList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);

  // @ts-ignore
  const {data} = null;

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`);
  };

  return (
    <div className={style.root}>
      <div className={style.controls}>
        <h1>{"공지사항"}</h1>
      </div>
      <ListPager page={page} pageItem={data} onChangePage={setPage}/>
    </div>
  );
};
