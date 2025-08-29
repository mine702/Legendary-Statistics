import {Adsense} from '@ctrl/react-adsense';
import './AdsenseStylesheet.css';

function AdsenseExample() {
  //console.log("Ads Shown")
  return (
    <Adsense
      className='ExampleAdSlot'
      client="ca-pub-3438793648335991"
      slot="4654118695"
      format={'auto'}
      responsive={'true'}
      style={{display: 'block'}}
    />
  )
}

export default AdsenseExample
