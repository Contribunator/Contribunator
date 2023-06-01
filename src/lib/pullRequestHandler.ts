import * as Yup from "yup";
import { NextRequest, NextResponse } from "next/server";

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

export default function pullRequestHandler(
  schema: any,
  transform: TransformToPR,
  Mocktokit?: any // only used for testing, TODO throw in prod?
) {
  return async (req: NextRequest) => {
    try {
      // parse body
      const body = await req.json();
      // ensure the request is authorized
      const authorized = await authorize(req, body);
      // validate the request body
      // TODO ensure we have some tests here for malicious input
      // TODO we may want to return a transformed object here
      await Yup.object({ ...schema, ...commonSchema }).validate(body);
      // apply this contribution type's transformations
      const transformed = await transform({ body, timestamp: timestamp() });
      // apply common transformations, e.g. pr messages
      const pr = await commonTransform({ body, pr: transformed });
      // create the PR
      const prUrl = await createPullRequest({ pr, authorized }, Mocktokit);
      // return PR URL
      return NextResponse.json({ prUrl });
    } catch (err) {
      // handle errors
      let message = "Something went wrong";
      if (err instanceof Error && err.message) {
        message = err.message;
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
