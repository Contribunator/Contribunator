import { AuthType, ConfigWithContribution } from "./config";

export type Authorized = {
  type: AuthType;
  [key: string]: any;
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

export type PRTransformInputs = {
  body: any;
  config: ConfigWithContribution;
};

export type TransformedPR = {
  message: string;
  title: string;
  branch: string;
  files: { [key: string]: string };
};

export type CommitInputs = {
  config: ConfigWithContribution;
  body: any;
  fields: any;
  timestamp: string;
  files: FetchedFiles;
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
