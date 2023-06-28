import { Body, Data, Meta } from "@/types";

export function destructureMeta(body: Body): { meta: Meta; data: Data } {
  const {
    authorization,
    customTitle,
    customMessage,
    captcha,
    repo,
    contribution,
    ...data
  } = body;

  return {
    meta: {
      authorization,
      customTitle,
      customMessage,
      captcha,
      repo,
      contribution,
    },
    data,
  };
}
