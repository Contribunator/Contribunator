import { AuthType, ConfigWithContribution } from "./config";

export type Authorized = {
  type: AuthType;
  [key: string]: any;
};

// todo
export type Data = any;
export type Body = any;

export type Meta = {
  authorization: AuthType[];
  customTitle?: string;
  customMessage?: string;
  captcha?: string;
  repo: string;
  contribution: string;
};

export type FetchData = {
  config: ConfigWithContribution;
  meta: Meta;
  data: Data;
};

export type FetchFiles = {
  config: ConfigWithContribution;
  meta: Meta;
  data: Data;
  fetched: FetchedData;
};

export type FetchedFile = {
  name: string;
  path: string;
  sha?: string;
  url?: string;
  type?: string;
  exists: boolean;
  content?: string;
  parsed?: any;
};
export type FetchedFiles = { [name: string]: FetchedFile };
export type FetchedData = any;

export type ExtractedImagesFlat = {
  [key: string]: string;
};
export type ExtractedImages = {
  images: ExtractedImagesFlat;
  data: Data;
};

// this also runs on client so don't require all fields
export type PrMetadata = (props: {
  meta: Meta;
  data: Data;
  config: ConfigWithContribution;
  images?: ExtractedImagesFlat;
  files?: FetchedFiles;
  timestamp?: string;
  fetched?: FetchedData;
}) => { title: string; message: string };

export type PRTransformInputs = {
  body: Body;
  config: ConfigWithContribution;
};

export type TransformedPR = {
  message: string;
  title: string;
  branch: string;
  files: { [key: string]: string };
};

export type CommitInputs = {
  images: ExtractedImagesFlat;
  title: string;
  message: string;
  branch: string;
  config: ConfigWithContribution;
  meta: Meta;
  data: Data;
  timestamp: string;
  files: FetchedFiles;
  fetched: FetchedData;
};

export type Commit = (inputs: CommitInputs) => Promise<CommitOutputs>;

export type CommitOutputs = {
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
