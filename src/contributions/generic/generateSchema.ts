import * as Yup from "yup";

import { GenericConfig, ImagesField } from "./config";
import {
  ALT_TEXT,
  validImageAlt,
  validImage,
  validImages,
  validImageAlts,
} from "@/lib/commonValidation";

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
    const { type, validation } = field;
    initialValues[name] = "";
    if (["text", "choice"].includes(type)) {
      schema[name] = Yup.string();
    }
    // TODO validate options are oneOf
    if (["image", "images"].includes(type)) {
      const single = type === "image";
      schema[name] = single ? validImage : validImages;
      schema[`${ALT_TEXT}${name}`] = single ? validImageAlt : validImageAlts;
    }
    if (type === "images") {
      const emptyArray = new Array((field as ImagesField).limit).fill("");
      initialValues[name] = emptyArray;
      initialValues[`${ALT_TEXT}${name}`] = emptyArray;
    }
    if (validation?.required) {
      schema[name] = schema[name].required(validation.required);
    }
  });

  return { schema, initialValues };
}
