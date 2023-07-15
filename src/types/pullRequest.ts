import { AuthType, ConfigWithContribution } from "./config";
import { Field } from "./form";
import { GithubProfile } from "next-auth/providers/github";

export type AuthorizedGithub = {
  type: "github";
  token: GithubProfile;
};

export type AuthorizedCaptcha = {
  type: "captcha";
};

export type AuthorizedApi = {
  type: "api";
  user: string;
};

export type AuthorizedAnon = {
  type: "anon";
};

export type Authorized =
  | AuthorizedGithub
  | AuthorizedCaptcha
  | AuthorizedApi
  | AuthorizedAnon;

export type Meta = {
  authorization: AuthType;
  repo: string;
  contribution: string;
  customTitle?: string;
  customMessage?: string;
  captcha?: string;
};

export type DataItem = Data | Data[] | string | string[] | number | number[];
export type Data = {
  [key: string]: DataItem;
};

export type Body = Meta & Data;

export type FormDataItem =
  | {
      data?: Data;
      field?: Field;
      name?: string;
      path?: string;
      fullTitle?: string;
      fileName?: string;
      filePath?: string;
      markdown?: string;
    }
  | { [key: string]: FormDataItem | FormDataItem[] };

export type FormData = {
  [key: string]: FormDataItem;
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
  parsed?: unknown;
};
export type FetchedFiles = { [name: string]: FetchedFile };
export type FetchedData = { [name: string]: unknown };

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
  formData: FormData;
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
  formData: FormData;
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
    [key: string]: unknown;
  };
  yaml?: {
    [key: string]: unknown;
  };
};

export type GithubCreateCommit = {
  base: string;
  repo: string;
  owner: string;
  branch: string;
  createBranch: boolean;
  author?: {
    name: string;
    email: string;
  };
  changes: [
    {
      message: string;
      files: {
        [key: string]: string;
      };
    }
  ];
};

export type GithubCreatePR = {
  base: string;
  title: string;
  repo: string;
  head: string;
  owner: string;
  body: string;
};

export type E2ETestResponse = {
  pr: GithubCreatePR;
  commit: GithubCreateCommit;
};
