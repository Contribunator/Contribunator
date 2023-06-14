import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { e2e } from "@/lib/env";

dayjs.extend(utc);

export default function timestamp(format = "YYMMDD-HHmm") {
  if (e2e) {
    return "TIMESTAMP";
  }
  return dayjs().utc().format(format);
}
