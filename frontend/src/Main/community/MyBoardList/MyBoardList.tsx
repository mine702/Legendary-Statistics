import style from "./MyBoardList.module.scss"
import {useSWRBoardCategories, useSWRMyBoardList} from "../../../server/server.ts";
import {useNavigate, useSearchParams} from "react-router";
import {ListPager} from "../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../util/hooks/useSearchParamState.ts";
import {BoardListItem} from "../../../component/board/BoardListItem.tsx";

export const MyBoardList = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const {data: categoryInfo} = useSWRBoardCategories();

  const searchParamList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamList, "page", 0);
  // @ts-ignore
  const {data} = useSWRMyBoardList(page);

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`)
  }

  return <div className={style.root}>
    <h1 style={{marginBottom: "40px"}}>문의 기록</h1>
    {data?.totalElements === 0 && <div className={style.noInquiry}>문의 기록이 없습니다.</div>}
    {data?.content.map((item, index) =>
      <BoardListItem onClickItem={onClickItem} item={item}
                     inquiryTypeInfo={categoryInfo[item.category]} hideUsername={true} key={index}/>
    )}
    <ListPager page={page} pageItem={data} onChangePage={setPage}/>
  </div>
}
