import { NextRequest, NextResponse } from "next/server";
import authorize from "./authorize";
import { getRepoConfig } from "./config";
import { createPullRequest } from "./github";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export type PullRequestInfo = {
  branch: string;
  name: string;
  files: {
    [key: string]: string;
  };
};

export type TransformToPR = ({
  body,
  timestamp,
}: {
  body: any;
  timestamp: string;
}) => Promise<PullRequestInfo>;

export default function submitHook(transformToPR: TransformToPR) {
  return async (
    req: NextRequest,
    { params: { repo } }: { params: { repo: string } }
  ) => {
    try {
      const repoConfig = getRepoConfig(repo);
      // TODO check if the repo allows this request
      const body = await req.json();
      const authorized = await authorize(req, body);
      const timestamp = dayjs().utc().format("YYMMDD-HHmm");
      console.log({ body, authorized, repoConfig });
      const pr = await transformToPR({ body, timestamp }); // pass the whole repo config if we need to
      const prUrl = await createPullRequest({ ...pr, repo, authorized });
      return NextResponse.json({ prUrl });
    } catch (err) {
      let message = "Something went wrong";
      if (err instanceof Error) {
        message = err.message;
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
