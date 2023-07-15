import { object, string } from "yup";

import type { Config, Repo } from "@/types";

import { isServer } from "@/lib/env";

const githubApp = {
  appId: process.env.GITHUB_APP_ID as string,
  installationId: process.env.GITHUB_APP_INSTALLATION_ID as string,
  privateKey: process.env.GITHUB_APP_PK,
};

const githubAppSchema = object({
  appId: string().required("GITHUB_APP_ID is required"),
  installationId: string().required("GITHUB_APP_INSTALLATION_ID is required"),
  privateKey: string().required("GITHUB_APP_PK is required"),
});

const auth = {
  github: {
    clientId: process.env.GITHUB_APP_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
  },
  captcha: {
    key: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string,
    secret: process.env.HCAPTCHA_SECRET as string,
  },
  api: ((): { keys: Record<string, string> | null } => {
    // transform the env variables to a k/v object
    if (process.env.API_KEYS) {
      const pattern = new RegExp(
        /^([a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)(\|[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)*$/
      );
      if (!pattern.test(process.env.API_KEYS)) {
        throw new Error(
          `Invalid API_KEYS env var. It must match the pattern API_KEYS=key1:abc123|key2:def456|key3:ghi789`
        );
      }
      const keys = process.env.API_KEYS.split("|").reduce((o, item) => {
        const [name, value] = item.split(":");
        return { ...o, [value]: name };
      }, {});
      return { keys };
    }
    return { keys: null };
  })(),
  anon: {},
};

const authSchema = {
  github: object({
    clientId: string().required(
      "GITHUB_APP_CLIENT_ID is required when using Github Auth"
    ),
    clientSecret: string().required(
      "GITHUB_APP_CLIENT_SECRET is required when using Github Auth"
    ),
  }),
  captcha: object({
    key: string().required(
      "NEXT_PUBLIC_HCAPTCHA_SITEKEY is required when using Captcha Auth"
    ),
    secret: string().required(
      "HCAPTCHA_SECRET is required when using Captcha Auth"
    ),
  }),
  api: object({
    keys: object().required("API_KEYS is required when using API Auth"),
  }),
  anon: object(),
};

export function validateEnv(config: Config) {
  if (!isServer) return;
  const validated: { [key: string]: boolean } = {};
  githubAppSchema.validateSync(githubApp);
  // check each repo and only test required auths
  Object.values(config.repos).forEach((repo: Repo) => {
    repo.authorization.forEach((authType) => {
      if (!auth[authType]) throw new Error(`Invalid auth type: ${authType}`);
      if (!validated[authType]) {
        validated[authType] = true;
        authSchema[authType].validateSync(auth[authType]);
      }
    });
  });
}

export { e2e, demo } from "@/lib/env";
export { auth, githubApp, isServer };
