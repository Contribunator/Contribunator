import getTimestamp from "@/lib/helpers/timestamp";

import YAML from "yaml";

import type { PRTransformInputs, TransformedPR } from "@/types";

import slugify from "@/lib/helpers/slugify";

import fetchFiles from "./fetchFiles";
import convertImages from "./convertImages";
import extractImages from "./extractImage";

export default async function pullRequestTransform({
  body,
  config,
}: PRTransformInputs): Promise<TransformedPR> {
  const { commit: getCommit } = config.contribution;

  if (!getCommit) {
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

  // extract and transform the image data

  // todo fetchData
  // TODO we should pass in the fetched data to prMetadata

  // todo fetchFiles
  const files = await fetchFiles({ config, body });

  const images = extractImages({ timestamp, fields, config });

  const prMetadata = config.contribution.prMetadata(body);
  const title = body.customTitle || prMetadata.title;
  const message = body.customMessage || prMetadata.message;
  const branch = slugify(`${timestamp} ${title}`);

  const commit = await getCommit({
    images,
    branch,
    message,
    title,
    config,
    body,
    fields,
    timestamp,
    files,
  });

  const transformed: TransformedPR = {
    title,
    message,
    branch,
    files: {},
  };

  if (files) {
    transformed.files = {
      ...transformed.files,
      ...commit.files,
    };
  }

  if (commit.images) {
    transformed.files = {
      ...transformed.files,
      ...(await convertImages(commit.images)),
    };
  }

  if (commit.json) {
    transformed.files = {
      ...transformed.files,
      ...Object.entries(commit.json).reduce(
        (acc, [fileName, value]) => ({
          ...acc,
          [fileName]: JSON.stringify(value, null, 2),
        }),
        {}
      ),
    };
  }

  if (commit.yaml) {
    transformed.files = {
      ...transformed.files,
      ...Object.entries(commit.yaml).reduce(
        (acc, [fileName, value]) => ({
          ...acc,
          [fileName]: YAML.stringify(value, { lineWidth: 0 }),
        }),
        {}
      ),
    };
  }

  return transformed;
}
