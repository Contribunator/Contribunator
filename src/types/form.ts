import type { FormikContextType } from "formik";
import type { Schema } from "yup";

import type { Props as ChoiceInput } from "@/components/form/fields/choiceInput";
import type { Props as CollectionInput } from "@/components/form/fields/collectionInput";
import type { Props as ImageInput } from "@/components/form/fields/imageInput";
import type { Props as ImagesInput } from "@/components/form/fields/imagesInput";
import type { Props as InfoField } from "@/components/form/fields/infoField";
import type { Props as TextInput } from "@/components/form/fields/textInput";

export type { NestedChoiceOptions } from "@/components/form/fields/choiceInput";
export type {
  IframeProps,
  Suggestion,
  Suggestions,
} from "@/components/form/fields/textInput";

export type Choice = { type: "choice" } & Omit<ChoiceInput, "name">;
export type Collection = { type: "collection" } & Omit<CollectionInput, "name">;
export type Image = { type: "image" } & Omit<ImageInput, "name">;
export type Images = { type: "images" } & Omit<ImagesInput, "name">;
export type Info = { type: "info" } & Omit<InfoField, "name">;
export type Text = { type: "text" } & Omit<TextInput, "name">;

type GenericField = Choice | Collection | Image | Images | Info | Text;

export type RegexValidation = {
  regex: RegExp;
  message?: string;
};

export type ValidationTypes = {
  required?: string | boolean;
  url?: string | boolean;
  email?: string | boolean;
  matches?: RegexValidation;
  min?: number;
  max?: number;
  yup?: Schema<any>;
};

// TODO move to collection?
export type VisibleProps = {
  formik: FormikContextType<any>;
  field: Field & { name: string };
};

type BaseField = {
  validation?: ValidationTypes;
  visible?: (p: VisibleProps) => boolean;
};

export type Field = BaseField & GenericField;

export type Fields = { [key: string]: Field };

export type Form = {
  title?: string;
  description?: string;
  fields: Fields;
};
