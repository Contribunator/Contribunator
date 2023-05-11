import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { captchaSecret } from "./env";

export type Authorized = {
  // TODO other types
  type: "token" | "anon" | "captcha" | "key";
  token?: {
    login: string;
    accessToken: string;
    name: string;
  };
};

export default async function authorize(
  req: NextRequest,
  body: any
): Promise<Authorized> {
  // TODO perhaps regenerate token if it's expired?

  const token = (await getToken({ req })) as {
    login: string;
    accessToken: string;
    name: string;
  };

  if (token) {
    console.log("token", token.login);
    return {
      type: "token",
      token,
    };
  }

  if (body.captcha) {
    const url = `https://hcaptcha.com/siteverify?secret=${captchaSecret}&response=${body.captcha}`;
    console.log(url);
    const repsonse = await fetch(url, {
      method: "POST",
    });
    const data = await repsonse.json();
    console.log("captcha", data);
    if (data.success) {
      return { type: "captcha" };
    }
  }
  // todo disable error anon is allowed
  throw new Error("Unauthorized");

  return { type: "anon" };
}
