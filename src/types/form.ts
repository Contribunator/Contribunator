import type { Schema } from "yup";
import type { FormikProps } from "formik";

import type { ConfigWithContribution } from "./config";
import type {
  FetchedFiles,
  Authorized,
  E2ETestResponse,
  Body,
} from "./pullRequest";

import type { Props as ChoiceInput } from "@/components/contribution/fields/choiceInput";
import type { Props as CollectionInput } from "@/components/contribution/fields/collectionInput";
import type { Props as ImageInput } from "@/components/contribution/fields/imageInput";
import type { Props as ImagesInput } from "@/components/contribution/fields/imagesInput";
import type { Props as InfoField } from "@/components/contribution/fields/infoField";
import type { Props as TextInput } from "@/components/contribution/fields/textInput";

export type { NestedChoiceOptions } from "@/components/contribution/fields/choiceInput";
export type {
  IframeProps,
  Suggestion,
  Suggestions,
} from "@/components/contribution/fields/textInput";

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
  yup?: Schema<unknown>;
};

// TODO move to collection?
export type VisibleProps = {
  formik: FormikContext;
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

export type FormikContext = FormikProps<Body>;

export type BaseFormProps = {
  formik: FormikContext;
  config: ConfigWithContribution;
};

export type FormProps = BaseFormProps & {
  files?: FetchedFiles;
  user?: Authorized;
};

export type PrMetaResponse = {
  title: string;
  number: number;
  url: string;
};

export type SubmitState = {
  pr?: PrMetaResponse;
  error?: string;
  submitting?: boolean;
  confirming?: boolean;
  body?: Body;
  test?: E2ETestResponse;
  mounting?: boolean;
};
