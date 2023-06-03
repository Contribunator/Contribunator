import * as Yup from "yup";
import { NextRequest, NextResponse } from "next/server";

import authorize from "./authorize";
import commonSchema from "./commonSchema";
import createPullRequest from "./createPullRequest";
import timestamp from "./timestamp";
import commonTransform from "./commonTransform";
import { getContribution } from "./config";

export type PullRequestInfo = {
  branch: string;
  title: string;
  message: string;
  files: {
    [key: string]: string;
  };
};

export type TransformInputs = { body: any; timestamp: string };
export type TransformToPR = (arg: TransformInputs) => Promise<PullRequestInfo>;

export default function pullRequestHandler(
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
      // get the config and schema
      const { contribution, repo } = getContribution(
        body.repo,
        body.contribution
      );
      console.log({ contribution });
      // TODO ensure we have some tests here for malicious input
      // TODO we may want to return a transformed object here
      await Yup.object({ ...contribution.schema, ...commonSchema }).validate(
        body
      );
      // apply this contribution type's transformations
      const transformed = await transform({ body, timestamp: timestamp() });
      // apply common transformations, e.g. pr messages
      const pr = await commonTransform({ body, pr: transformed });
      // create the PR
      const prUrl = await createPullRequest(
        { pr, authorized, repo },
        Mocktokit
      );
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
