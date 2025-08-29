import {Adsense} from '@ctrl/react-adsense';
import style from './AdsenseHorizontal.module.scss';

export const AdsenseHorizontal = () => {
  return (
    // JSX
    <div className={style.adWrap}>
      <Adsense
        className={style.horizontal}
        client="ca-pub-3438793648335991"
        slot="4654118695"
        format="auto"
        responsive="true"
      />
    </div>
  )
};

