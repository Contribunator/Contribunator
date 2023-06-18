// TODO use `zod`

import type { Config } from "@/types";

export const e2e = process.env.NEXT_PUBLIC_TESTING === "E2E";
export const dev = process.env.NEXT_PUBLIC_TESTING === "DEV";
export const demo = process.env.NEXT_PUBLIC_TESTING === "DEMO";
export const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET as string;
export const clientId = process.env.GITHUB_APP_CLIENT_ID as string;
export const appId = parseInt(process.env.GITHUB_APP_ID as string);
export const installationId = parseInt(
  process.env.GITHUB_APP_INSTALLATION_ID as string
);
export const privateKey = process.env.GITHUB_APP_PK as string;
export const captchaKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string;
export const captchaSecret = process.env.HCAPTCHA_SECRET as string;
export const apiKeys = process.env.API_KEYS?.split("|").reduce((o, item) => {
  const [name, value] = item.split(":");
  return { ...o, [value]: name };
}, {});

export const highlightProject = process.env
  .NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID as string;

// validate env vars, throws the build if any are missing
function required(key: string) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export function validate(config: Config) {
  if (typeof window !== "undefined") return;
  // github credentials always required to make PRs
  ["GITHUB_APP_ID", "GITHUB_APP_INSTALLATION_ID", "GITHUB_APP_PK"].forEach(
    required
  );

  if (config.authorization.includes("github")) {
    ["GITHUB_APP_CLIENT_SECRET", "GITHUB_APP_CLIENT_ID"].forEach(required);
  }
  if (config.authorization.includes("captcha")) {
    ["NEXT_PUBLIC_HCAPTCHA_SITEKEY", "HCAPTCHA_SECRET"].forEach(required);
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
    }
  }
}
