import pino from "pino";
import { log as logtail } from "@logtail/next";

import deepObjectMap from "./helpers/deepObjectMap";

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

function withFilter(logger: any) {
  const filter = (args: unknown[]): unknown[] => {
    return args.map((arg) =>
      deepObjectMap(arg, (key, value) => {
        // TODO make this configurable, perhaps fitler other types of sensitive data
        if (`${key}`.endsWith(".captcha")) {
          return "[CAPTCHA FILTERED]";
        }
        if (`${key}`.endsWith(".data") && `${value}`.length > 5000) {
          return "[DATA FILTERED]";
        }
        return value;
      })
    );
  };
  return {
    trace: (...args: unknown[]) => logger.trace(...filter(args)),
    debug: (...args: unknown[]) => logger.debug(...filter(args)),
    info: (...args: unknown[]) => logger.info(...filter(args)),
    warn: (...args: unknown[]) => logger.warn(...filter(args)),
    error: (...args: unknown[]) => logger.error(...filter(args)),
    fatal: (...args: unknown[]) => logger.fatal(...filter(args)),
  };
}

export default withFilter(getLogger());
