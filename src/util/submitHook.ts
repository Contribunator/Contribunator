import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as Yup from "yup";

import authorize from "./authorize";
import commonSchema from "./commonSchema";
import { createPullRequest } from "./github";

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

export default function submitHook(
  type: string,
  schema: any,
  transformToPR: TransformToPR
) {
  return async (
    req: NextRequest,
    { params: { repo } }: { params: { repo: string } }
  ) => {
    try {
      const body = await req.json();
      const authorized = await authorize(req, body);

      if (body?.repo !== repo) {
        throw new Error("Specified repository is invalid");
      }
      if (body?.contribution !== type) {
        throw new Error("Contribution type is invalid");
      }
      // TODO ensure body matches path
      await Yup.object({ ...schema, ...commonSchema }).validate(body);
      const timestamp = dayjs().utc().format("YYMMDD-HHmm");
      const pr = await transformToPR({ body, timestamp });
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
