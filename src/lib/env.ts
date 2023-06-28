// shared between server and client
export const isServer = typeof window === "undefined";
export const e2e = process.env.NEXT_PUBLIC_TESTING === "E2E";
export const demo = process.env.NEXT_PUBLIC_TESTING === "DEMO";

// client only
export const captchaKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string;
