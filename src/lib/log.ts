import pino from "pino";

function getLogger() {
  // TODO enable once logtail in workers is working
  // if (process.env.LOGTAIL_SOURCE_TOKEN) {
  //   return pino(
  //     pino.transport({
  //       target: "@logtail/pino",
  //       options: { sourceToken: process.env.LOGTAIL_SOURCE_TOKEN },
  //     })
  //   );
  // }
  return pino({
    level: process.env.CI ? "silent" : "trace",
  });
}

export default getLogger();
