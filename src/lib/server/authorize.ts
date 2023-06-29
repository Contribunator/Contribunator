import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { GithubProfile } from "next-auth/providers/github";

import { Authorized, ConfigWithContribution } from "@/types";
import { auth } from "@/lib/env.server";
import log from "@/lib/log";

type AuthFunction = ({
  req,
  body,
}: {
  req: NextRequest;
  body: any;
}) => Promise<any>;

const authMethods: Record<string, AuthFunction> = {
  github: async function ({ req }) {
    // TODO, get a new oauth token with octokit
    const token = (await getToken({ req })) as GithubProfile;
    if (token) {
      log.info({ msg: "authorized github user", login: token.login });
      return {
        type: "github",
        token,
      };
    }
  },
  captcha: async function ({ body }) {
    if (body.captcha) {
      const url = `https://hcaptcha.com/siteverify?secret=${auth.captcha.secret}&response=${body.captcha}`;
      const response = await fetch(url, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        log.info({ msg: "authorized captcha" });
        return {
          type: "captcha",
        };
      } else {
        log.warn({ msg: "captcha failed", data });
      }
    }
  },
  api: async function ({ req }) {
    const apiKey = req.headers.get("x-api-key");
    const user = apiKey && auth.api.keys?.[apiKey];
    if (user) {
      log.info({ msg: "authorized API key", user });
      return {
        type: "api",
        user,
      };
    } else {
      log.warn({ msg: "api key not found", key: apiKey?.slice(0, 3) });
    }
  },
  anon: async function () {
    log.info({ msg: "authorized anon" });
    return { type: "anon" };
  },
};

type AuthProps = {
  req: NextRequest;
  body: any;
  config: ConfigWithContribution;
};

export default async function authorize({
  config,
  req,
  body,
}: AuthProps): Promise<Authorized> {
  if (!config.repo.authorization.includes(body.authorization)) {
    throw new Error("Invalid authorization");
  }
  const authorized = await authMethods[body.authorization]({ req, body });
  if (!authorized) {
    throw new Error("Unauthorized");
  }
  return authorized;
}
