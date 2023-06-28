import type { IconType } from "react-icons";

import {
  Commit,
  FetchData,
  FetchFiles,
  FetchedData,
  PrMetadata,
} from "./pullRequest";
import { Form } from "./form";
import { Repo } from "./config";

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
  name?: string;
  color: TailwindColor;
  hidden?: boolean;
  icon: IconType;
};

export type ContributionLoaded = {
  form: Form;
  commit: Commit;
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
    prMetadata: PrMetadata;
    schema: any; // TODO // generated
  };

// resolved config
export type ContributionConfig = ContributionMeta & {
  load: (name: string, repoConfig: Repo) => Promise<Contribution>;
};

// passed options
export type ContributionOptions = Partial<ContributionMeta> & {
  load: (name: string, repoConfig: Repo) => Promise<ContributionLoaded>;
};

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
