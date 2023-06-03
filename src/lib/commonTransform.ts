import slugify from "slugify";

import { PullRequestInfo } from "./pullRequestHandler";

export default function commonTransforms({
  pr,
  body,
}: {
  pr: PullRequestInfo;
  body: any;
}): PullRequestInfo & { repo: string } {
  // TODO, we should pass explicit values here as a sanity check
  return {
    ...pr,
    // override the generated title and message if it's set
    ...(body.customTitle && {
      title: slugify(body.customTitle, {
        lower: true,
        strict: true,
        replacement: " ",
      }),
    }),
    ...(body.customMessage && { message: body.customMessage }),
    repo: body.repo,
  };
}
