import YAML from "yaml";

import slugify from "./slugify";
import convertImages from "./convertImages";

import { TransformOutputs } from "./pullRequestHandler";
import { ConfigWithContribution } from "./config";

type CommonTransformInptus = {
  body: any;
  transformed: TransformOutputs;
  timestamp: string;
  config: ConfigWithContribution;
};

export type CommonTransformOutputs = {
  branch: string;
  message?: string;
  title: string;
  files: {
    [key: string]: string;
  };
};

function toJson(obj: { [fileName: string]: string }) {
  return Object.keys(obj).reduce((acc, fileName) => {
    return {
      ...acc,
      [fileName]: JSON.stringify(obj[fileName], null, 2),
    };
  }, {});
}

function toYaml(obj: { [fileName: string]: string }) {
  return Object.keys(obj).reduce((acc, fileName) => {
    return {
      ...acc,
      [fileName]: YAML.stringify(obj[fileName]),
    };
  }, {});
}

export default async function commonTransform({
  transformed,
  config,
  timestamp,
  body,
}: CommonTransformInptus): Promise<CommonTransformOutputs> {
  const prMeta = config.contribution.prMetadata(body);
  const title = body.customTitle || prMeta.title;
  const message = body.customMessage || prMeta.message;
  const branch = slugify(`${timestamp} ${title}`);
  const files = {
    ...transformed.files,
    ...(transformed.images && (await convertImages(transformed.images))),
    ...(transformed.json && toJson(transformed.json)),
    ...(transformed.yaml && toYaml(transformed.yaml)),
  };
  return {
    files,
    message,
    title,
    branch,
  };
}
