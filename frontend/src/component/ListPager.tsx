import style from "./ListPager.module.scss"
import {Pager} from "../../../../wiztim-webserver/frontend/src/server/pager.ts";
import {IconButton} from "../../../../wiztim-webserver/frontend/src/component/simple/IconButton.tsx";
import LeftIcon from "../../../../wiztim-webserver/frontend/src/assets/icons/left.svg";
import RightIcon from "../../../../wiztim-webserver/frontend/src/assets/icons/right.svg";

interface Props {
  page: number;
  pageItem: Pager<any> | undefined;
  onChangePage: (page: number) => void
}

export const ListPager = (props: Props) => {
  const goToPrevPage = () => {
    if ((props.pageItem?.first ?? false) === false) props.onChangePage(props.page - 1)
  }
  const goToNextPage = () => {
    if ((props.pageItem?.last ?? false) === false) props.onChangePage(props.page + 1)
  }

  if (props.pageItem == undefined) return null

  //표시해야할 페이지 리스트 계산.
  //기본 10개까지 표시되고, 10개가 넘어갈경우 현재 페이지를 기준으로 앞으로 4개, 뒤로 5개가 표시되도록 셋팅
  //전체 페이지는 11개있는데 현재 페이지가 7이라면 2,3,4,5,6,7,8,9,10,11이 표시되어야함
  let pageListToShow: number[] = [];
  if (props.pageItem.totalPages == 0) {
    pageListToShow.push(0);
  } else if (props.pageItem.totalPages <= 10) {
    for (let i = 0; i < props.pageItem.totalPages; i++) {
      pageListToShow.push(i);
    }
  } else {
    let start = props.page - 4;
    let end = props.page + 5;
    if (start < 0) {
      start = 0;
      end = 10;
    }
    if (end > props.pageItem.totalPages) {
      start = props.pageItem.totalPages - 10;
      end = props.pageItem.totalPages;
    }
    for (let i = start; i < end; i++) {
      pageListToShow.push(i);
    }
  }


  return (
    <div className={style.root}>
      <IconButton onClick={goToPrevPage}>
        <img src={LeftIcon as string} alt="이전페이지"/>
      </IconButton>
      {pageListToShow.map((page) => {
        return (
          <button key={page} onClick={() => props.onChangePage(page)}
                  className={`custom ${style.pageNumber} ${page === props.page ? style.selected : ""}`}>
            {page + 1}
          </button>
        )
      })}
      <IconButton onClick={goToNextPage}>
        <img src={RightIcon as string} alt="다음페이지"/>
      </IconButton>
    </div>
  )
}
