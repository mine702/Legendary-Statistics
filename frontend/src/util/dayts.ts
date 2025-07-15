/** dayts.ts는 dayjs를 타입스크립트에서 활용하면서, 플러그인을 전역으로 적용할 수 있도록 합니다. */
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {formatterPlugin} from "./dayjsFormatterPlugin";
import "dayjs/locale/ko";
import isBetween from "dayjs/plugin/isBetween";

declare module "dayjs" {
  interface Dayjs {
    toDateString(): string;

    toDateTimeString(): string;

    toKoreanDateString(): string;

    toKoreanShortTimeString(hourMode: "h" | "H"): string;

    toKoreanShortTimeRangeString(endAt: dayjs.Dayjs, hourMode: "h" | "H"): string;

    toKoreanDateTimeString(hourMode: "h" | "H"): string;
  }

  interface DayjsStatic {
    fromDateString(datetime: string): dayjs.Dayjs;

    fromDateTimeString(date: string): dayjs.Dayjs;
  }
}

dayjs.extend(objectSupport);
dayjs.extend(formatterPlugin);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.locale("ko");

export default dayjs;
