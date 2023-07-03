import { NextRequest, NextResponse } from "next/server";

import getConfig from "@/lib/config";
import log from "@/lib/log";

import submitPullRequest from "./submitPullRequest";
import transformPullRequest from "./transformPullRequest";
import authorize from "./authorize";

export default async function postContribution(req: NextRequest) {
  try {
    // parse body
    const body = await req.json();

    // validate body basics
    if (!body.repo) throw new Error("Repository name required");
    if (!body.contribution) throw new Error("Contribution name required");

    // get the config and schema for contribution
    const config = await getConfig(body.repo, body.contribution);

    // ensure the request is authorized, throw early if not
    const authorized = await authorize({ req, body, config });

    // validate the schema, returns an object we can trust
    const validated = await config.contribution.schema.validate(body, {
      strict: true,
    });

    console.info({ authorized, config: validated });

    // transform a PR
    const transformed = await transformPullRequest({ body: validated, config });

    // create the PR
    const data = await submitPullRequest({
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
    log.error(err || message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
