import { Contribution } from "@/lib/config";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";
import { InfoField } from "@/components/form/infoField";
import { CollectionInput } from "@/components/form/collectionInput";

import generateSchema, { ValidationTypes } from "./generateSchema";
import { FormikContextType } from "formik";
import { TailwindColor } from "@/lib/tailwindColors";

type FieldType = "text" | "choice" | "image" | "images" | "collection" | "info";

type VisibleProps = {
  formik: FormikContextType<any>;
  field: Field & { name: string };
};
type BaseField = {
  type: FieldType;
  validation?: ValidationTypes;
  visible?: (
    p: VisibleProps
  ) => boolean | { query: string; visible: (p: VisibleProps) => boolean };
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

type GenericConfigInput = Partial<Omit<GenericConfig, "schema">> & {
  options: GenericOptions;
};

export default function genericConfig(opts: GenericConfigInput): GenericConfig {
  // throw if invalid options
  // TODO when commit is passed, wrap it wtih convenience methods
  // throw if using reserved names e.g. `title` and `message`
  // TODO option for collections
  const config = {
    title: "Generic Contribution",
    description: "This is a generic contribution",
    color: "red" as TailwindColor,
    prMetadata({ repo, authorization, contribution, ...fields }: any = {}): {
      title: string;
      message: string;
    } {
      const itemName = fields.title || fields.name;
      return {
        title: `Add ${config.title}${itemName ? `: ${itemName}` : ""}`,
        message: `This PR adds a new ${config.title}:

${Object.entries(config.options.fields)
  .map(([key, { title }]) => {
    const value = fields[key];

    if (!value) {
      return null;
    }

    let valueString = value;
    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        valueString = value.join(", ");
      } else {
        valueString = valueString.length + " item(s)";
      }
    } else if (typeof value === "object") {
      valueString = "✔";
    }
    if (typeof value === "boolean") {
      valueString = value ? "✔" : "❌";
    }
    if (valueString.length > 250) {
      valueString = valueString.slice(0, 250) + "... [trimmed]";
    }

    return `## ${title}\n${valueString}`;
  })
  .filter((i) => i)
  .join("\n\n")}`,
      };
    },
    ...opts,
    type: "generic",
    options: {
      ...opts.options,
    },
  };

  return { ...config, schema: generateSchema(config) };
}
