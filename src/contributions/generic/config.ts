import { Contribution, TailwindColor } from "@/lib/config";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";
import { InfoField } from "@/components/form/infoField";
import { CollectionInput } from "@/components/form/collectionInput";

import generateSchema, { ValidationTypes } from "./generateSchema";

type FieldType = "text" | "choice" | "image" | "images" | "collection" | "info";

type BaseField = {
  type: FieldType;
  validation?: ValidationTypes;
  visible?: (values: any) => boolean;
};

export type Text = Omit<TextInput, "name">;
export type Choice = Omit<ChoiceInput, "name">;
export type Image = Omit<ImageInput, "name">;
export type Images = Omit<ImagesInput, "name">;
export type Info = Omit<InfoField, "name">;
export type Collection = Omit<CollectionInput, "name">;

export type GenericField = Text | Choice | Image | Images | Info | Collection;
export type Field = BaseField & GenericField;
export type Fields = { [key: string]: Field };

type CommitOutput = Omit<TransformOutputs, "title" | "message">;

type GenericOptions = {
  commit: (arg: TransformInputs) => Promise<CommitOutput>;
  fields: Fields;
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

type GenericConfigInput = Partial<Omit<GenericConfig, "schema">> & {
  options: GenericOptions;
};

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

  return { ...config, schema: generateSchema(config) };
}
