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

export default function pullRequestHandler(
  transformToPR: TransformToPR,
  Mocktokit?: any // only used for testing, TODO throw in prod?
) {
  return async (req: NextRequest) => {
    try {
      // parse body
      const body = await req.json();
      // ensure the request is authorized, throw early if not
      const authorized = await authorize(req, body);
      // get the config and schema, validates request
      const config = getContribution(body.repo, body.contribution);
      // validate the schema
      // TODO we may want to return a Yup-transformed object here for easier transforms later
      await Yup.object({
        ...config.contribution.schema,
        ...commonSchema,
      }).validate(body);

      // transform the PR
      const prOpts = {
        config,
        body,
        timestamp: getTimestamp(),
        files: await fetchFiles(config, false),
      };
      // apply the type-specific transformation
      const transformed = await transformToPR(prOpts);
      // apply common transformations, ensure formatting, cerate title/branch/message, convert images
      const pr = await commonTransform({ ...prOpts, transformed });
      // create the PR
      const prUrl = await createPullRequest(
        { pr, authorized, config },
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
