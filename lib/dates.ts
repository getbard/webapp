import { format, isToday, formatDistanceToNow } from 'date-fns';

export const formatPretty = (dateString: string, min?: boolean): string => {
  const date = new Date(dateString);
  return isToday(date)
    ? `${formatDistanceToNow(date)} ${min ? '' : 'ago'}`
    : `${min ? '' : 'on'} ${format(date, 'MMM do, yyyy')}`;
}