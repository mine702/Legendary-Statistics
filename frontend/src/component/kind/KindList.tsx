import defaultImage from "../../assets/img/강도깨비.png";
import style from "./KindList.module.scss";
import {useSWRGetKindList} from "../../server/server.ts";
import {useState} from "react";

interface Props {
  selectedId: number | undefined;
  setSelectedId: (id: number) => void;
}

export const KindList = ({selectedId, setSelectedId}: Props) => {
  const {data: list} = useSWRGetKindList();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={style.root}>
      <div className={style.searchBar}>
        <input
          type="text"
          placeholder="꼬마 전설이 입력..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={style.listContainer}>
        {list?.filter((item) => item.name.includes(searchTerm)).map((item) => (
          <div
            key={item.id}
            className={`${style.card} ${selectedId === item.id ? style.active : ""}`}
            onClick={() => setSelectedId(item.id)}
          >
            <img src={item?.path || defaultImage} alt={item.name} className={style.image}/>
            <div className={style.name}>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
