import style from "./Reroll.module.scss"
import {AdsenseSide} from "../adsense/AdsenseSide.tsx";
import rerollLogo from "../../assets/img/reroll_logo.png";
import {RerollSimulator} from "./rerollSimulator/RerollSimulator.tsx";

export const Reroll = () => {

  return (
    <div className={style.root}>
      <div className={style.layout}>
        <aside className={style.left}>
          <AdsenseSide placement="left" slot="2131611729"/>
        </aside>

        <main className={style.mid}>
          <div className={style.container}>
            {/* 헤더 이미지 */}
            <div className={style.headerWrapper}>
              <img src={rerollLogo} alt="로고"/>
            </div>

            <div className={style.content}>
              <RerollSimulator/>
            </div>
          </div>
        </main>
        <aside className={style.right}>
          <AdsenseSide placement="right" slot="4933444977"/>
        </aside>
      </div>
    </div>
  )
}
