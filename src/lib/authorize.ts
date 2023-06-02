import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { GithubProfile } from "next-auth/providers/github";

import config from "./config";
import { captchaSecret, apiKeys } from "./env";

type AuthFunction = ({
  req,
  body,
}: {
  req: NextRequest;
  body: any;
}) => Promise<any>;

const authMethods: Record<string, AuthFunction> = {
  github: async function ({ req }) {
    const token = (await getToken({ req })) as GithubProfile;

    if (token) {
      console.log("authorized github user", token.login);
      return {
        type: "github",
        token,
      };
    }
  },
  captcha: async function ({ body }) {
    if (body.captcha) {
      const url = `https://hcaptcha.com/siteverify?secret=${captchaSecret}&response=${body.captcha}`;
      const response = await fetch(url, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        console.log("authorized captcha");
        return {
          type: "captcha",
        };
      } else {
        console.log("captcha failed", data);
      }
    }
  },
  // TODO test this works
  api: async function ({ req }) {
    const apiKey = req.headers.get("x-api-key");
    const user = apiKey && apiKeys[apiKey];
    if (user) {
      console.log("authorized API key", user);
      return {
        type: "api",
        user,
      };
    } else {
      console.log("api key not found", apiKey?.slice(0, 3));
    }
  },
  anon: async function () {
    console.log("authorized anon");
    return { type: "anon" };
  },
};

export type AuthType = keyof typeof authMethods;

export type Authorized = {
  type: AuthType;
  [key: string]: any;
};

export default async function authorize(
  req: NextRequest,
  { authorization, ...body }: { authorization: AuthType }
): Promise<Authorized> {
  if (!config.authorization.includes(authorization)) {
    throw new Error("Invalid authorization");
  }
  const authorized = await authMethods[authorization]({ req, body });
  if (authorized) {
    return authorized;
  }
  throw new Error("Unauthorized");
}