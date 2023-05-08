import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export type Authorized = {
  // TODO other types
  type: "token" | "anon" | "captcha" | "key";
  token?: {
    login: string;
    accessToken: string;
    name: string;
  };
};

export default async function authorize(req: NextRequest): Promise<Authorized> {
  // TODO perhaps regenerate token if it's expired?

  const token = (await getToken({ req })) as {
    login: string;
    accessToken: string;
    name: string;
  };

  if (token) {
    return {
      type: "token",
      token,
    };
  }

  // TODO require captcha for anon

  // TODO throw if not authorized

  return { type: "anon" };
}
