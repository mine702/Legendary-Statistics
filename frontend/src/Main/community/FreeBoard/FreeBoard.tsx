import style from "./FreeBoard.module.scss";
import {useNavigate, useSearchParams} from "react-router";
import {useSWRAllInquiryList, useSWRInquiryCategories} from "../../../../../server/server.ts";
import {ListPager} from "../../../../../component/ListPager.tsx";
import {useSearchParamState} from "../../../../../util/hooks/useSearchParamState.ts";
import {useEffect} from "react";
import {parseJWT} from "../../../../../util/loginManager.ts";
import {InquiryListItem} from "../../../../../component/board/BoardListItem.tsx";

export const FreeBoard = () => {
  const navigate = useNavigate();

  const searchParamsList = useSearchParams();
  const [page, setPage] = useSearchParamState<number>(searchParamsList, "page", 0);
  const [category, setCategory] = useSearchParamState<string>(searchParamsList, "category", "");
  const {data: categoryInfo} = useSWRInquiryCategories();

  const {data} = useSWRAllInquiryList(page, category);

  const onClickItem = (id: number) => {
    navigate(`../detail/${id}`);
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(0);
  }

  //DEV권한이 없는 경우 메인페이지로 이동
  useEffect(() => {
    if (!parseJWT().dev) navigate("/main/p");
  }, []);

  return (
    <div className={style.root}>
      <div className={style.controls}>
        <h1>문의 기록</h1>
        <select className={style.dropdown} value={category} onChange={onChangeCategory}>
          <option value="">전체</option>
          {Object.keys(categoryInfo)
            .filter((key) => categoryInfo[key].showOnAllLists)
            .map((key) => <option key={key} value={key}>
              {categoryInfo[key].displayTitle}
            </option>)}
        </select>
      </div>
      {data?.totalElements === 0 && <div className={style.noInquiry}>문의 기록이 없습니다.</div>}
      {data?.content.map((item, index) =>
        <InquiryListItem onClickItem={onClickItem} item={item}
                         inquiryTypeInfo={categoryInfo[item.category]} key={index}/>
      )}
      <ListPager page={page} pageItem={data} onChangePage={setPage}/>
    </div>
  );
};
