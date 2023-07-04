import pino from "pino";
import { log as logtail } from "@logtail/next";

// TODO filter out captcha, image data

function getLogger() {
  if (process.env.LOGTAIL_SOURCE_TOKEN) {
    return logtail;
  }
  return pino({
    level: process.env.CI ? "silent" : "trace",
    hooks: {
      logMethod(args, method) {
        method.apply(this, [{ msg: args[0], ...args[1] }]);
      },
    },
  });
}

export default getLogger();
