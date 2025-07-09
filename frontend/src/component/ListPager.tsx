import style from "./ListPager.module.scss";
import {IconButton} from "./simple/IconButton.tsx";
import LeftIcon from "../assets/icons/left.svg";
import RightIcon from "../assets/icons/right.svg";
import {PagedContent} from "../server/pager.ts";

interface Props {
  page: number;
  pageItem: PagedContent<any> | undefined;
  onChangePage: (page: number) => void;
}

export const ListPager = (props: Props) => {
  if (!props.pageItem) return null;

  const {first, last, totalPages} = props.pageItem;

  const goToPrevPage = () => {
    if (!first) props.onChangePage(props.page - 1);
  };
  const goToNextPage = () => {
    if (!last) props.onChangePage(props.page + 1);
  };

  let pageListToShow: number[] = [];
  if (totalPages === 0) {
    pageListToShow.push(0);
  } else if (totalPages <= 10) {
    for (let i = 0; i < totalPages; i++) {
      pageListToShow.push(i);
    }
  } else {
    let start = props.page - 4;
    let end = props.page + 5;
    if (start < 0) {
      start = 0;
      end = 10;
    }
    if (end > totalPages) {
      start = totalPages - 10;
      end = totalPages;
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
      {pageListToShow.map((page) => (
        <button
          key={page}
          onClick={() => props.onChangePage(page)}
          className={`custom ${style.pageNumber} ${page === props.page ? style.selected : ""}`}
        >
          {page + 1}
        </button>
      ))}
      <IconButton onClick={goToNextPage}>
        <img src={RightIcon as string} alt="다음페이지"/>
      </IconButton>
    </div>
  );
};
