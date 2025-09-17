import style from "./Reroll.module.scss"
import {useSWRGetRerollProbability} from "../../server/server.ts";
import {useEffect} from "react";

export const Reroll = () => {
  
  const {data: rerollProbability} = useSWRGetRerollProbability(1, 5);

  useEffect(() => {
    console.log(rerollProbability);
  }, [rerollProbability]);

  return (
    <div className={style.root}>

    </div>
  )
}
