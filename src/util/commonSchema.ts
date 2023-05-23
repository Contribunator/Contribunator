import { getConfig } from "@/util/config";
import * as Yup from "yup";

// TODO add options branch, star etc.
// TODO optimize this so we only validate cetain options server side?
const { repos, authorization } = getConfig();

const commonSchema = {
  customName: Yup.string().max(100),
  customMessage: Yup.string(),
  repo: Yup.string().oneOf(Object.keys(repos)).required("Invalid repository"),
  contribution: Yup.string().test({
    name: "is-valid-contribution",
    test(value, ctx) {
      try {
        if (!value) {
          throw new Error("No contribution type specified");
        }
        getConfig(ctx.parent.repo, value); // will throw is not found
      } catch {
        return ctx.createError({
          message: `Invalid contribution type ${value} for repo ${ctx.parent.repo}`,
        });
      }
      return true;
    },
  }),
  authorization: Yup.string()
    .oneOf(authorization)
    .required(`You must specify an auth type: ${authorization.join(", ")}`),
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
