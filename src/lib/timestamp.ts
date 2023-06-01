import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function timestamp() {
  return dayjs().utc().format("YYMMDD-HHmm");
}
