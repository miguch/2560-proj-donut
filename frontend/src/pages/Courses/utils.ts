import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const timeFmt = 'HH:mm';

export function timeToVal(timeStr: string) {
  const time = dayjs(timeStr, timeFmt);
  return time.hour() * 60 + time.minute();
}

export function valToTime(timeNum: number) {
  const hour = Math.floor(timeNum / 60);
  const mins = timeNum % 60;
  return dayjs({
    minute: mins,
    hour: hour,
  }).format(timeFmt);
}
