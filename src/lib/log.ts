import pino from "pino";

const log = pino({
  level: process.env.CI ? "silent" : "trace",
});

export default log;
