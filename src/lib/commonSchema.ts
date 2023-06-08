import * as Yup from "yup";

import config, { getRepo, getContribution } from "./config";

// TODO add options branch, star etc.
// TODO optimize this so we only validate cetain options server side?
const { authorization } = config;

const commonSchema = {
  customTitle: Yup.string().max(100, "Title is too long"),
  customMessage: Yup.string(),
  // todo use getConfig?
  repo: Yup.string().test({
    test(value) {
      getRepo(value as string); // will throw if not found
      return true;
    },
  }),
  contribution: Yup.string().test({
    test(value, ctx) {
      getContribution(ctx.parent.repo, value as string); // will throw if not found
      return true;
    },
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
