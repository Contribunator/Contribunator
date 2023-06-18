import getTimestamp from "@/lib/helpers/timestamp";

import YAML from "yaml";

import type { PRTransformInputs, TransformedPR } from "@/types";

import slugify from "@/lib/helpers/slugify";

import fetchFiles from "./fetchFiles";
import convertImages from "./convertImages";

export default async function pullRequestTransform({
  body,
  config,
}: PRTransformInputs): Promise<TransformedPR> {
  const { commit } = config.contribution;

  if (!commit) {
    throw new Error("Contribution has no commit method defined!");
  }

  const timestamp = getTimestamp();

  // destructure fields
  const {
    authorization,
    customTitle,
    customMessage,
    captcha,
    repo,
    contribution,
    ...fields
  } = body;

  // type-specific transform
  const { files, json, yaml, images } = await commit({
    config,
    body,
    fields,
    timestamp,
    files: await fetchFiles({ config, body }),
  });

  const prMetadata = config.contribution.prMetadata(body);
  const title = body.customTitle || prMetadata.title;

  return {
    title,
    message: body.customMessage || prMetadata.message,
    branch: slugify(`${timestamp} ${title}`),
    files: {
      ...files,
      ...(images && (await convertImages(images))),
      ...(json &&
        Object.keys(json).reduce(
          (acc, fileName) => ({
            ...acc,
            [fileName]: JSON.stringify(json[fileName], null, 2),
          }),
          {}
        )),
      ...(yaml &&
        Object.keys(yaml).reduce(
          (acc, fileName) => ({
            ...acc,
            [fileName]: YAML.stringify(yaml[fileName], {
              lineWidth: 0,
              // TODO make configurable, inherit from source
              // defaultKeyType: "PLAIN",
              // defaultStringType: "QUOTE_DOUBLE",
              // collectionStyle: "flow",
            }),
          }),
          {}
        )),
    },
  };
}
