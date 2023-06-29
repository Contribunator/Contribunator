import pino from "pino";

const log = pino({
  level: process.env.CI ? "silent" : "debug",
});

export default log;
