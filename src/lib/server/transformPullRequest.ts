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
  // generate a common timestamp
  const timestamp = getTimestamp();
  // group common fields
  const common = { ...destructureMeta(body), config, timestamp };
  // fetchData
  const fetched = await fetchData(common);
  // todo fetchFiles
  const files = await fetchFiles({ ...common, fetched });
  // extract images from form, decorates data with image filenames
  const { images, data } = extractImages(common);
  // group for reuse
  const prData = { ...common, fetched, files, images, data, timestamp };
  // generate metadata
  const prMetadata = contribution.prMetadata(prData);
  // override metadata if custom values set
  const title = common.meta.customTitle || prMetadata.title;
  const message = common.meta.customMessage || prMetadata.message;
  const branch = slugify(`${timestamp} ${title}`);
  const meta = { title, message, branch };
  // pass all available data for user to play with
  const commit = await contribution.commit({ ...prData, ...meta });
  // build the PR object
  const transformed: TransformedPR = { ...meta, files: {} };
  // add passed files
  if (files) {
    transformed.files = {
      ...transformed.files,
      ...commit.files,
    };
  }
  // convert passed images
  if (commit.images) {
    transformed.files = {
      ...transformed.files,
      ...(await convertImages(commit.images)),
    };
  }
  // stringify passed json
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
  // stringify passed yaml
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
  // voila
  return transformed;
}
