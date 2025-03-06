import style from "./PcMain.module.scss"
import {PcTopBar} from "./PcTopBar.tsx";

export const PcMain = () => {
  return (
    <div className={style.root}>
      <PcTopBar />
      <h1>PC Main</h1>
    </div>
  )
}
