import { Contribution, TailwindColor } from "@/lib/config";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";

import generateSchema from "./generateSchema";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";

type ValidationOptions = { required?: string; min?: number; max?: number };

type FieldType = "text" | "choice" | "image" | "images";

export type TextField = Omit<TextInput, "name">;
export type ChoiceField = Omit<ChoiceInput, "name">;
export type ImageField = Omit<ImageInput, "name">;
export type ImagesField = Omit<ImagesInput, "name">;

type BaseField = {
  type: FieldType;
  validation?: ValidationOptions;
  visible?: (values: any) => boolean;
  // embed?: (values: any) => boolean;
};

type Field = BaseField & (TextField | ChoiceField | ImageField | ImagesField);

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
