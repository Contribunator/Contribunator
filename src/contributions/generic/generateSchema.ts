import * as Yup from "yup";

import { ChoiceField, GenericConfig, ImagesField } from "./config";
import { ALT_TEXT, imageSchema } from "@/lib/commonValidation";
import { NestedChoiceOptions } from "@/components/form/choiceInput";

type RegexValidation = {
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
  yup?: Yup.Schema<any>;
};

export default function generateSchema(
  contribution: Omit<GenericConfig, "schema" | "initialValues">
) {
  const {
    options: { fields },
  } = contribution;

  const schema: any = {};
  const initialValues: any = {};

  // TODO, make this only run once per instantiation
  // console.log("buidling schema");

  Object.entries(fields).forEach(([name, field]) => {
    if (field.type === "info") {
      return;
    }

    const { type, initialValue = "", validation = {} } = field;

    // set empty initial values to prevent react errors
    initialValues[name] = initialValue;

    // images have an array of empty values
    if (type === "images") {
      const emptyArray = new Array((field as ImagesField).limit).fill("");
      initialValues[name] = emptyArray;
      initialValues[`${ALT_TEXT}${name}`] = emptyArray;
    }

    // we can skip the rest if yup is passed
    if (validation.yup) {
      schema[name] = validation.yup;
      return;
    }

    // otherwise generate the schema
    if (["text", "choice"].includes(type)) {
      schema[name] = Yup.string();
      // add lavel for better error messages
      if (field.title) {
        schema[name] = schema[name].label(field.title);
      }
    }

    if (type === "choice") {
      // generate list of options for validation
      const choices: string[] = [];
      const getOptions = (options: NestedChoiceOptions, parentKey?: string) => {
        Object.entries(options).forEach(([key, val]) => {
          const thisKey = parentKey ? `${parentKey}.${key}` : key;
          if (val.options) {
            getOptions(val.options, thisKey);
          } else {
            choices.push(thisKey);
          }
        });
      };
      getOptions((field as ChoiceField).options);
      schema[name] = schema[name].oneOf(choices);
    }

    // images have special validation schemas
    if (["image", "images"].includes(type)) {
      const { image, alt } = imageSchema(type === "images", field.title);
      schema[name] = image;
      schema[`${ALT_TEXT}${name}`] = alt;
    }

    Object.entries(validation).forEach(([key, value]) => {
      if (key === "matches") {
        const { regex, message } = value as RegexValidation;
        schema[name] = schema[name].matches(regex, message);
      } else if (typeof value === "string" || typeof value === "number") {
        schema[name] = schema[name][key](value);
      } else {
        schema[name] = schema[name][key]();
      }
    });
  });

  return { schema, initialValues };
}
