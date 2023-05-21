import slugify from "slugify";
import { PullRequestInfo } from "./submitHook";

export default function commonTransforms({
  pr,
  body,
}: {
  pr: PullRequestInfo;
  body: any;
}): PullRequestInfo {
  return {
    ...pr,
    ...(body.customName && {
      name: slugify(body.customName, {
        lower: true,
        strict: true,
        replacement: " ",
      }),
    }),
    ...(body.customMessage && { message: body.customMessage }),
  };
}
