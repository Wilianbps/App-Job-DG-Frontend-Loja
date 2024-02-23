import { format } from "date-fns";

export function getHourFromISODate(dateISO: string) {
  const date = new Date(dateISO);
  const hour = format(date, "HH:mm:ss");
  
  return hour;
}
