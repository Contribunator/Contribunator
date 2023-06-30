import { AuthType, ConfigWithContribution } from "./config";
import { Field } from "./form";

export type Authorized = {
  type: AuthType;
  [key: string]: any;
};

// todo
export type Data = any;
export type Body = any;
// a merged version of the data and the form

export type FormDataItem =
  | {
      data?: any;
      field?: Field;
      fullTitle?: string;
      fileName?: string;
      filePath?: string;
      markdown?: string;
    }
  | { [key: string]: FormDataItem | FormDataItem[] };

export type FormData = {
  [key: string]: FormDataItem;
};

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
    [key: string]: any;
  };
  yaml?: {
    [key: string]: any;
  };
};
