import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {reCaptchaKey} from "../../config.ts";
import {NewLegendMain} from "./main/NewLegendMain.tsx";

export const NewLegend = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      <NewLegendMain/>
    </GoogleReCaptchaProvider>
  );
};
