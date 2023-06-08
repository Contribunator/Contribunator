import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function timestamp(format = "YYMMDD-HHmm") {
  return dayjs().utc().format(format);
}
