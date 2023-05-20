import config, { getRepoConfig } from "@/util/config";
import * as Yup from "yup";

// TODO add branch, committer details, message, star etc.
// TODO optimize this so we only validate cetain options server side?

const commonSchema = {
  // add repo and type here
  repo: Yup.string().oneOf(Object.keys(config.repos)).required("Invalid repo"),
  contribution: Yup.string().test({
    name: "is-valid-contribution",
    test(value, ctx) {
      // TODO in future we may want to update config to include specific type options
      const match = getRepoConfig(ctx.parent.repo).contributions.find(
        (c) => c.type === value
      );
      if (!match) {
        return ctx.createError({
          message: `Invalid contribution type ${value} for repo ${ctx.parent.repo}`,
        });
      }
      return true;
    },
  }),
  authorization: Yup.string()
    .oneOf(config.authorization)
    .required(
      `You must specify an auth type: ${config.authorization.join(", ")}`
    ),
  captcha: Yup.string().when(["authorization"], {
    is: (authorization: string) => authorization === "captcha",
    then: (schema) => {
      let message = "Please complete the CAPTCHA check";
      if (config.authorization.includes("github")) {
        message += " or sign in";
      }
      return schema.required(message);
    },
  }),
};

export default commonSchema;
