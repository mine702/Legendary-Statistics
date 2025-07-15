import dayjs, {Dayjs} from "dayjs";

export const formatterPlugin = (_option, dayjsClass: any, dayjsFactory) => {
  //dayjs와 typescript의 구조적 한계로 intelij에서 format 함수를 인식할수 없으나, 빌드는 가능함
  dayjsClass.prototype.toDateString = function (): string {
    return this.format('YYYY-MM-DD');
  }
  dayjsClass.prototype.toDateTimeString = function (): string {
    return this.format('YYYY-MM-DD HH:mm:ss');
  }
  dayjsClass.prototype.toKoreanDateString = function (): string {
    return this.format('YYYY년 MM월 DD일');
  }
  dayjsClass.prototype.toKoreanShortTimeString = function (hourMode: 'h' | 'H'): string {
    return hourMode === 'H' ?
      this.format(this.minute() === 0 ? 'H시' : 'H시 m분') :
      this.format(this.minute() === 0 ? 'A h시' : 'A h시 m분');
  }
  dayjsClass.prototype.toKoreanShortTimeRangeString = function (endAt: Dayjs, hourMode: 'h' | 'H'): string {

    let startTimeFormatedStr = this.format(
      hourMode === 'H' ?
        this.minute() === 0 ? 'H시' : 'H시 m분' :
        this.minute() === 0 ? 'A h시' : 'A h시 m분');
    //종료시간의 오전/오후 시간대가 다른경우, 오전/오후를 붙여줌
    let endTimeFormatedStr = this.format('A') !== endAt.format('A') ? endAt.format('A ') : '';
    endTimeFormatedStr += endAt.format(
      hourMode === 'H' ?
        endAt.minute() === 0 ? 'H시' : 'H시 m분' :
        endAt.minute() === 0 ? 'h시' : 'h시 m분')
    return `${startTimeFormatedStr} ~ ${endTimeFormatedStr}`;
  }
  dayjsClass.prototype.toKoreanDateTimeString = function (hourMode: 'h' | 'H'): string {
    return this.format(hourMode == 'H' ? 'YYYY년 M월 D일 H시 m분' : 'YYYY년 M월 D일 A h시 m분');
  }
  dayjsFactory.fromDateString = function (datetime: string): dayjs.Dayjs {
    return dayjsFactory(datetime, 'YYYY-MM-DD HH:mm:ss', true);
  }
  dayjsFactory.fromDateTimeString = function (date: string): dayjs.Dayjs {
    return dayjsFactory(date, 'YYYY-MM-DD', true);
  }
}
