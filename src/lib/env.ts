import config from "./config";

const env = {
  clientId: process.env.GITHUB_APP_CLIENT_ID as string,
  clinetSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
  appId: parseInt(process.env.GITHUB_APP_ID as string),
  installationId: parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string),
  privateKey: process.env.GITHUB_APP_PK as string,
  captchaKey: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string,
  captchaSecret: process.env.HCAPTCHA_SECRET as string,
  apiKeys: {} as Record<string, string>,
};

export type AuthType = keyof typeof env;

function required(key: AuthType) {
  if (!env[key]) {
    // fail the build if values aren't set
    throw new Error(`Missing required env var ${key}`);
  }
}

if (typeof window === "undefined") {
  // always required to make PRs
  (["appId", "installationId", "privateKey"] as AuthType[]).forEach(required);

  if (config.authorization.includes("github")) {
    (["clientId", "clinetSecret"] as AuthType[]).forEach(required);
  }
  if (config.authorization.includes("captcha")) {
    (["captchaKey", "captchaSecret"] as AuthType[]).forEach(required);
  }
  if (config.authorization.includes("api")) {
    const pattern = new RegExp(
      /^([a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)(\|[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)*$/
    );
    if (
      !process.env.API_KEYS ||
      !pattern.test(process.env.API_KEYS as string)
    ) {
      throw new Error(
        `Invalid API_KEYS env var. It must match the pattern API_KEYS=key1:abc123|key2:def456|key3:ghi789`
      );
    } else {
      env.apiKeys = process.env.API_KEYS.split("|").reduce((o, item) => {
        const [name, value] = item.split(":");
        return { ...o, [value]: name };
      }, {});
    }
  }
}

export const clientId = env.clientId;
export const clientSecret = env.clinetSecret;
export const appId = env.appId;
export const installationId = env.installationId;
export const privateKey = env.privateKey;
export const captchaKey = env.captchaKey;
export const captchaSecret = env.captchaSecret;
export const apiKeys = env.apiKeys;
