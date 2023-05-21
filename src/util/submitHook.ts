import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

import authorize from "./authorize";
import commonSchema from "./commonSchema";
import createPullRequest from "./createPullRequest";
import timestamp from "./timestamp";
import commonTransform from "./commonTransform";

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
      // parse body
      const body = await req.json();
      // ensure the request is authorized
      const authorized = await authorize(req, body);
      // ensure the request body matches the route
      if (!body) {
        throw new Error("Invalid request");
      }
      if (body.repo !== repo) {
        throw new Error("Specified repository is invalid");
      }
      if (body.contribution !== type) {
        throw new Error("Contribution type is invalid");
      }
      // validate the request body
      await Yup.object({ ...schema, ...commonSchema }).validate(body);
      // transform the request into a PR
      // TODO move all common stuff ionto this function to DRY
      const pr = await commonTransform({
        body,
        pr: await transformToPR({ body, timestamp: timestamp() }),
      });
      // TODO add custom commit message etc.
      // create the PR
      const prUrl = await createPullRequest({ ...pr, repo, authorized });
      // return PR URL
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
