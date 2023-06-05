import * as Yup from "yup";

import { GenericConfig, ImagesField } from "./config";
import {
  ALT_TEXT,
  validImageAlt,
  validImage,
  validImages,
  validImageAlts,
} from "@/lib/commonValidation";

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
    const { type, validation = {} } = field;

    if (["text", "choice"].includes(type)) {
      schema[name] = Yup.string();
    }
    // for better error messages
    if (field.title) {
      schema[name] = schema[name].label(field.title);
    }
    // TODO validate options are oneOf
    if (["image", "images"].includes(type)) {
      const single = type === "image";
      schema[name] = single ? validImage : validImages;
      schema[`${ALT_TEXT}${name}`] = single ? validImageAlt : validImageAlts;
    }

    // todo restrict this to only the types that can be validated
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

    // set initial values
    initialValues[name] = "";
    if (type === "images") {
      const emptyArray = new Array((field as ImagesField).limit).fill("");
      initialValues[name] = emptyArray;
      initialValues[`${ALT_TEXT}${name}`] = emptyArray;
    }
  });

  return { schema, initialValues };
}
