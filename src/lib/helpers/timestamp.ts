import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { e2e } from "@/lib/env";

dayjs.extend(utc);

export function getTimeStamp(
  format = "YYMMDD-HHmm",
  date?: string,
  tagOrSkipTag?: string | boolean
) {
  if (e2e && tagOrSkipTag !== true) {
    return tagOrSkipTag ? tagOrSkipTag : "TIMESTAMP";
  }
  const dayjsDate = date ? dayjs.utc(date) : dayjs.utc();
  return dayjsDate.format(format);
}

export function getDateStamp(date?: string, tagOrSkipTag?: string | boolean) {
  return getTimeStamp("YYYY-MM-DD", date, tagOrSkipTag);
}
