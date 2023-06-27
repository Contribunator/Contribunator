import getTimestamp from "@/lib/helpers/timestamp";

import YAML from "yaml";

import type { PRTransformInputs, TransformedPR } from "@/types";

import slugify from "@/lib/helpers/slugify";

import fetchFiles from "./fetchFiles";
import convertImages from "./convertImages";
import extractImages from "./extractImage";
import { destructureMeta } from "../helpers/destructureMeta";
import fetchData from "./fetchData";

export default async function transformPullRquest({
  body,
  config,
}: PRTransformInputs): Promise<TransformedPR> {
  const { contribution } = config;

  if (!contribution.commit) {
    throw new Error("Contribution has no commit method defined!");
  }

  const timestamp = getTimestamp();

  // destructure fields
  const { data, meta } = destructureMeta(body);
  // fetchData
  const fetched = await fetchData({ config, data, meta });
  // todo fetchFiles
  const files = await fetchFiles({ config, data, meta, fetched });
  // extract images from form
  const images = extractImages({ timestamp, data, config });
  // generate metadata
  const prMetadata = contribution.prMetadata({
    config,
    data,
    fetched,
    files,
    images,
    meta,
    timestamp,
  });

  // override metadata if custom values set
  const title = meta.customTitle || prMetadata.title;
  const message = meta.customMessage || prMetadata.message;
  const branch = slugify(`${timestamp} ${title}`);

  // pass all available data for user to play with
  const commit = await contribution.commit({
    branch,
    config,
    data,
    fetched,
    files,
    images,
    message,
    meta,
    timestamp,
    title,
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
