import { getConfig } from "@/util/config";
import * as Yup from "yup";

// TODO add options branch, star etc.
// TODO optimize this so we only validate cetain options server side?
const { authorization } = getConfig();

const commonSchema = {
  customName: Yup.string().max(100, "Name is too long"),
  customMessage: Yup.string(),
  // todo use getConfig?
  repo: Yup.string().test({
    name: "is-valid-repo",
    test(value, ctx) {
      if (!value) {
        return ctx.createError({
          message: "No repo specified",
        });
      }
      try {
        getConfig(value); // will throw if not found
      } catch {
        return ctx.createError({
          message: "Invalid repo",
        });
      }
      return true;
    },
  }),
  contribution: Yup.string()
    // only trigger validation if repo is set, to ensure correct sequence of error messages
    // TODO why does this work again?
    .when("repo", {
      is: (repo: string) => !!repo,
      then: (schema) =>
        schema.test({
          name: "is-valid-contribution",
          test(value, ctx) {
            if (!value) {
              return ctx.createError({
                message: "No contribution specified",
              });
            }
            try {
              getConfig(ctx.parent.repo, value); // will throw if not found
            } catch {
              return ctx.createError({
                message: "Invalid contribution",
              });
            }
            return true;
          },
        }),
    }),
  authorization: Yup.string().oneOf(authorization, "Invalid authorization"),
  captcha: Yup.string().when(["authorization"], {
    is: (authorization: string) => authorization === "captcha",
    then: (schema) => {
      let message = "Please complete the CAPTCHA check";
      if (authorization.includes("github")) {
        message += " or sign in";
      }
      return schema.required(message);
    },
  }),
};

export default commonSchema;
