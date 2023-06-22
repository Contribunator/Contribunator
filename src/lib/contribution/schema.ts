import * as Yup from "yup";

import type {
  Choice,
  Collection,
  ContributionOptions,
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
  contribution: ContributionOptions & { name: string },
  repo: Repo
): Yup.ObjectSchema<any> {
  const buildSchema = (fields: Fields) => {
    const schema: any = {};

    Object.entries(fields).forEach(([name, field]) => {
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
        // TODO, prepend field name to nested fields
        schema[name] = Yup.array();
        const subSchema = buildSchema((field as Collection).fields);
        // TODO api test empty arrays and require them
        schema[name] = schema[name].of(Yup.object(subSchema));
      }

      // otherwise generate the schema
      if (type === "text") {
        schema[name] = Yup.string();
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
          schema[name] = Yup.array();
          schema[name] = schema[name].of(Yup.string().oneOf(choices));
        } else {
          schema[name] = Yup.string();
          schema[name] = schema[name].oneOf(choices);
        }
      }

      if (["image", "images"].includes(type)) {
        let image = Yup.object({
          type: Yup.string()
            .oneOf(["png", "jpg", "jpeg"])
            .when("data", {
              is: (data: string) => !!data,
              then: (schema) => schema.required(),
            }),
          alt: Yup.string().max(999),
          editing: Yup.string().test({
            test(data = "", ctx) {
              if (data) {
                return ctx.createError({
                  message: "Please complete crop selection",
                });
              }
              return true;
            },
          }),
          data: Yup.string().test({
            test(data = "", ctx) {
              if (!data) {
                return true;
              }
              if (
                data.match(
                  /^data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
                )
              ) {
                return true;
              }
              return ctx.createError({
                message: "Invalid image data",
              });
            },
          }),
        });
        if (type === "images") {
          schema[name] = Yup.array().of(image);
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

  return Yup.object({
    // contribution specific schema
    ...buildSchema(contribution.form.fields),
    // common schema
    customTitle: Yup.string().max(100, "Title is too long"),
    customMessage: Yup.string(),
    repo: Yup.string().oneOf([repo.name]).required(),
    contribution: Yup.string().oneOf([contribution.name]).required(),
    authorization: Yup.string()
      .oneOf(repo.authorization, "Invalid authorization")
      .required(),
    captcha: Yup.string().when(["authorization"], {
      is: (authorization: string) => authorization === "captcha",
      then: (schema) => {
        let message = "Please complete the CAPTCHA check";
        if (repo.authorization.includes("github")) {
          message += " or sign in with Github";
        }
        return schema.required(message);
      },
    }),
  });
}
