import { NextRequest, NextResponse } from "next/server";

import { getContribution } from "@/lib/config";

import createPR from "./pullRequestCreate";
import transformPR from "./pullRequestTransform";
import authorize from "./authorize";

export default async function postContribution(req: NextRequest) {
  try {
    // parse body
    const body = await req.json();

    // ensure the request is authorized, throw early if not
    const authorized = await authorize(req, body);

    // get the config and schema for contribution
    const config = getContribution(body.repo, body.contribution);

    // validate the schema, returns an object we can trust
    const validated = await config.contribution.schema
      .noUnknown("Unexpected field in request body")
      .validate(body, { strict: true });

    // transform a PR
    const transformed = await transformPR({ body: validated, config });

    // create the PR
    const data = await createPR({
      transformed,
      authorized,
      config,
    });

    return NextResponse.json(data);
  } catch (err) {
    // handle errors
    let message = "Something went wrong";
    if (err instanceof Error && err.message) {
      message = err.message;
    }
    // todo return correct error code
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
