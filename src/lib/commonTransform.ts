import slugify from "./slugify";
import { TransformOutputs } from "./pullRequestHandler";
import { ConfigWithContribution } from "./config";
import { convertImages } from "./convertImages";

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
  };

  return {
    files,
    message,
    title,
    branch,
  };
}
