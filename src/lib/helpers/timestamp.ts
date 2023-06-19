import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { e2e } from "@/lib/env";

dayjs.extend(utc);

export default function timestamp(
  format = "YYMMDD-HHmm",
  date?: string,
  tag?: string
) {
  if (e2e) {
    return tag ? tag : "TIMESTAMP";
  }
  const dayjsDate = date ? dayjs.utc(date) : dayjs.utc();
  return dayjsDate.format(format);
}
