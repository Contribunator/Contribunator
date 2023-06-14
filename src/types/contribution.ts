import type { IconType } from "react-icons";

import { Commit } from "./pullRequest";
import { Form } from "./form";

export type Icon = IconType;

export type UseFiles =
  | { [key: string]: string }
  | ((values: any) => { [key: string]: string });

// TODO replace body with actual body
export type PrMetadata = (body: any) => { title: string; message: string };

export type Contribution = {
  title: string;
  description: string;
  color: TailwindColor;
  form: Form;
  schema: any; // TODO
  commit: Commit;
  prMetadata: PrMetadata;
  icon: IconType;
  useFiles?: UseFiles; // server and client
  useFilesOnClient?: UseFiles; // client only
  useFilesOnServer?: UseFiles; // server only
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type ContributionOptions = Optional<
  Contribution,
  "prMetadata" | "color" | "icon" | "title" | "description" | "schema"
>;

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
