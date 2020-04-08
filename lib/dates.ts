import { format, isToday, formatDistanceToNow } from 'date-fns';

export const formatPretty = (dateString: string): string => {
  const date = new Date(dateString);
  return isToday(date) ? `${formatDistanceToNow(date)} ago` : `on ${format(date, 'MMM do, yyyy')}`;
}