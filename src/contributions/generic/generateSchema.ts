import * as Yup from "yup";

import { Choice, Collection, Fields, GenericConfig } from "./config";
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
  contribution: Omit<GenericConfig, "schema">
) {
  const { options } = contribution;

  const buildSchema = (fields: Fields) => {
    const schema: any = {};

    Object.entries(fields).forEach(([name, field]) => {
      if (field.type === "info") {
        return;
      }

      const { type, validation = {} } = field;

      // we can skip the rest if yup is passed
      if (validation.yup) {
        schema[name] = validation.yup;
        return;
      }

      // recursively build if we have a collection
      if (field.type === "collection") {
        // TODO, prepend field name to nested fields
        schema[name] = Yup.array();
        if (field.title) {
          schema[name] = schema[name].label(field.title);
        }
        const subSchema = buildSchema((field as Collection).fields);
        schema[name] = schema[name].of(Yup.object(subSchema));
      }

      // otherwise generate the schema
      if (["text", "choice"].includes(type)) {
        schema[name] = Yup.string();
        if (field.title) {
          schema[name] = schema[name].label(field.title);
        }
      }

      if (type === "choice") {
        // generate list of options for validation
        const choices: string[] = [];
        const getOptions = (
          options: NestedChoiceOptions,
          parentKey?: string
        ) => {
          Object.entries(options).forEach(([key, val]) => {
            const thisKey = parentKey ? `${parentKey}.${key}` : key;
            if (val.options) {
              getOptions(val.options, thisKey);
            } else {
              choices.push(thisKey);
            }
          });
        };
        getOptions((field as Choice).options);
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
    return schema;
  };

  return buildSchema(options.fields);
}
