import type { IconType } from "react-icons";

import {
  Commit,
  Data,
  FetchData,
  FetchFiles,
  FetchedData,
  PrMetadata,
} from "./pullRequest";
import { Form } from "./form";
import { Repo } from "./config";
import { DeepPartial } from ".";

export type Icon = IconType;

export type UseFiles =
  | { [key: string]: string }
  | ((props: FetchFiles) => {
      [key: string]: string;
    });

export type UseData = (props: FetchData) => Promise<FetchedData>;

export type ContributionMeta = {
  title: string;
  description: string;
  color: TailwindColor;
  icon: IconType;
  hidden?: boolean;
};

export type FormOverrides = DeepPartial<Form>;

export type ContributionCommonOptions = Partial<ContributionMeta> & {
  form?: FormOverrides | (() => Promise<FormOverrides>);
};

export type ContributionLoaded = {
  form: Form;
  commit: Commit;
  imagePath?: string;
  imageName?: (props: { data: Data }) => string;
  prMetadata?: PrMetadata;
  useFiles?: UseFiles; // server and client
  useFilesOnClient?: UseFiles; // client only
  useFilesOnServer?: UseFiles; // server only
  useData?: UseData;
  useDataOnServer?: UseData;
  useDataOnClient?: UseData;
};

export type Contribution = ContributionMeta &
  Omit<ContributionLoaded, "prMetadata"> & {
    name: string;
    prMetadata: PrMetadata;
    schema: any; // TODO // generated
  };

// resolved config
export type ContributionConfig = ContributionMeta & {
  load: (name: string, repoConfig: Repo) => Promise<Contribution>;
};

export type ContributionSync = ContributionCommonOptions & ContributionLoaded;
export type ContributionAsync = ContributionCommonOptions & {
  load: () => Promise<
    ContributionLoaded | { default: () => ContributionLoaded }
  >;
};

// passed options
export type ContributionOptions = ContributionAsync | ContributionSync;

export type TailwindColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";
