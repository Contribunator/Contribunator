import * as Yup from "yup";
import { NextRequest, NextResponse } from "next/server";

import authorize from "./authorize";
import commonSchema from "./commonSchema";
import createPullRequest from "./createPullRequest";
import getTimestamp from "./timestamp";
import commonTransform from "./commonTransform";
import { ConfigWithContribution, getContribution } from "./config";
import fetchFiles, { Files } from "./fetchFiles";

export type TransformInputs = {
  body: any;
  fields: any;
  timestamp: string;
  config: ConfigWithContribution;
  files: Files;
};

export type TransformOutputs = {
  message?: string;
  title?: string;
  images?: {
    [key: string]: string;
  };
  files?: {
    [key: string]: string;
  };
  json?: {
    [key: string]: any;
  };
  yaml?: {
    [key: string]: any;
  };
};

export type TransformToPR = (arg: TransformInputs) => Promise<TransformOutputs>;

export default function pullRequestHandler(transformToPR: TransformToPR) {
  return async (req: NextRequest) => {
    try {
      // parse body
      const body = await req.json();
      // ensure the request is authorized, throw early if not
      const authorized = await authorize(req, body);
      // get the config and schema, validates request
      const config = getContribution(body.repo, body.contribution);

      // validate the schema, returns an object we can trust
      const validated = await Yup.object({
        ...config.contribution.schema,
        ...commonSchema,
      })
        .noUnknown("Unexpected field in request body")
        .validate(body, { strict: true });

      // console.log("valid body", validated);
      // destructure form fields
      const {
        authorization,
        contribution,
        repo,
        customName,
        customMessage,
        ...fields
      } = validated;

      // transform the PR
      const prOpts = {
        config,
        body: validated,
        fields,
        timestamp: getTimestamp(),
        files: await fetchFiles(config, false),
      };
      // TODO merge this into once method after removing twitter
      // apply the type-specific transformation
      const transformed = await transformToPR(prOpts);
      // apply common transformations, ensure formatting, cerate title/branch/message, convert images
      const commonTransformed = await commonTransform({
        ...prOpts,
        transformed,
      });
      // create the PR
      const { pr, test } = await createPullRequest({
        commonTransformed,
        authorized,
        config,
      });
      // return test data if testing
      if (process.env.NEXT_PUBLIC_TESTING === "E2E") {
        return NextResponse.json({ pr, test });
      }
      // return PR URL
      return NextResponse.json({ pr });
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
