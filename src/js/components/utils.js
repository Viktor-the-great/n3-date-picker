import moment from 'moment';
import business from 'moment-business';

export function isWeekend(day) {
  return business.isWeekendDay(moment().isoWeekday(day));
}
