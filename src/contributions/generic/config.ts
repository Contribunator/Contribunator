import { Contribution, TailwindColor } from "@/lib/config";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";

import generateSchema, { ValidationTypes } from "./generateSchema";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";

type FieldType = "text" | "choice" | "image" | "images";

export type TextField = Omit<TextInput, "name">;
export type ChoiceField = Omit<ChoiceInput, "name">;
export type ImageField = Omit<ImageInput, "name">;
export type ImagesField = Omit<ImagesInput, "name">;

type BaseField = {
  type: FieldType;
  validation?: ValidationTypes;
  initialValue?: any;
  visible?: (values: any) => boolean;
  // embed?: (values: any) => boolean;
};

type InfoField = {
  type: "info";
  text: string;
  visible?: (values: any) => boolean;
};

type Field =
  | InfoField
  | (BaseField & (TextField | ChoiceField | ImageField | ImagesField));

type CommitOutput = Omit<TransformOutputs, "title" | "message">;

type GenericOptions = {
  commit: (arg: TransformInputs) => Promise<CommitOutput>;
  fields: {
    [key: string]: Field;
  };
};

export type GenericConfig = Contribution & {
  type: string;
  options: GenericOptions;
};

const defaultConfig = {
  title: "Generic Contribution",
  description: "This is a generic contribution",
  color: "red" as TailwindColor,
  prMetadata: () => ({
    title: "Add Generic Contribution",
    message: "This PR adds a Generic Contribution",
  }),
};

type GenericConfigInput = Partial<
  Omit<GenericConfig, "initialValues" | "schema">
> & { options: GenericOptions };

export default function genericConfig(opts: GenericConfigInput): GenericConfig {
  // throw if invalid options
  // TODO when commit is passed, wrap it wtih convenience methods
  // throw if using reserved names e.g. `title` and `message`
  // TODO option for collections
  const config = {
    ...defaultConfig,
    ...opts,
    type: "generic",
    options: {
      ...opts.options,
    },
  };

  return { ...config, ...generateSchema(config) };
}
