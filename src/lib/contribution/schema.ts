import { ObjectSchema, array, object, string } from "yup";

import type {
  Choice,
  Collection,
  Contribution,
  Fields,
  NestedChoiceOptions,
  RegexValidation,
  Repo,
} from "@/types";

export const RESERVED = [
  "customTitle",
  "customMessage",
  "repo",
  "contribution",
  "authorization",
  "captcha",
];

export default function generateSchema(
  contribution: Omit<Contribution, "schema" | "prMetadata">,
  repo: Repo
): ObjectSchema<any> {
  const buildSchema = (fields: Fields) => {
    const schema: any = {};

    Object.entries(fields).forEach(([name, field]) => {
      const title = field.title || name;

      const { type, validation = {} } = field;

      // skip generation if not an input field
      if (type === "info") {
        return;
      }
      // skip generation if yup is passed
      if (validation.yup) {
        schema[name] = validation.yup;
        return;
      }

      // recursively build if we have a collection
      if (field.type === "collection") {
        schema[name] = array();
        const subSchema = buildSchema((field as Collection).fields);
        schema[name] = schema[name]
          .of(
            object(subSchema)
              .test({
                message: `${title} has an empty item`,
                test: (data) => Object.keys(data).length > 0,
              })
              .noUnknown(`${title} has an invalid field`)
          )
          .min(1, `${title} must not be empty`);
      }

      // otherwise generate the schema
      if (type === "text") {
        schema[name] = string();
      }

      if (type === "choice") {
        // generate list of options for validation
        const choiceField = field as Choice;
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
        getOptions(choiceField.options);

        if (choiceField.multiple) {
          schema[name] = array();
          schema[name] = schema[name].of(string().oneOf(choices));
        } else {
          schema[name] = string();
          schema[name] = schema[name].oneOf(choices);
        }
      }

      if (["image", "images"].includes(type)) {
        let data = string().test({
          test(data = "", ctx) {
            if (!data) {
              return true;
            }
            // if it's a jpeg or png
            if (
              data.startsWith("data:image/jpeg") ||
              data.startsWith("data:image/png")
            ) {
              return true;
            }
            return ctx.createError({
              message: "Invalid image data",
            });
          },
        });

        // add required validation
        if (field.validation?.required && type === "image") {
          const reqText =
            typeof field.validation.required === "string"
              ? field.validation.required
              : `${title} is a required field`;
          data = data.required(reqText);
        }

        const image = object({
          data,
          type: string()
            .oneOf(["png", "jpg", "jpeg"])
            .when("data", {
              is: (data: string) => !!data,
              then: (schema) => schema.required(),
            }),
          alt: string().max(999),
          editing: string().test({
            test(data = "", ctx) {
              if (data) {
                return ctx.createError({
                  message: "Please complete crop selection",
                });
              }
              return true;
            },
          }),
        });
        if (type === "images") {
          schema[name] = array().of(image);
        } else {
          schema[name] = image;
        }
      }

      // add label to fields
      if (field.title) {
        schema[name] = schema[name].label(field.title);
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

  Object.keys(contribution.form.fields).forEach((name) => {
    if (RESERVED.includes(name)) {
      throw new Error(`Field name "${name}" is reserved`);
    }
  });

  return object({
    // contribution specific schema
    ...buildSchema(contribution.form.fields),
    // common schema
    customTitle: string().max(100, "Title is too long"),
    customMessage: string(),
    repo: string().oneOf([repo.name]).required(),
    contribution: string().oneOf([contribution.name]).required(),
    authorization: string()
      .oneOf(repo.authorization, "Invalid authorization")
      .required(),
    captcha: string().when(["authorization"], {
      is: (authorization: string) => authorization === "captcha",
      then: (schema) => {
        let message = "Please complete the CAPTCHA check";
        if (repo.authorization.includes("github")) {
          message += " or sign in with Github";
        }
        return schema.required(message);
      },
    }),
  }).noUnknown("Unexpected field in request body");
}
