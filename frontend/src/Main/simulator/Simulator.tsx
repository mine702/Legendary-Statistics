import style from "./Simulator.module.scss"
import {useSWRGetTreasureList} from "../../server/server.ts";

export const Simulator = () => {
  const {data: list, isLoading} = useSWRGetTreasureList();

  return (
    <div className={style.root}>

    </div>
  )
}
