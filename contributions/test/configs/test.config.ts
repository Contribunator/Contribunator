// you can add custom test configs for your contributions here that will be included in test:e2e

import userConfig from "@/../contribunator.config";

const testConfig = {
  ...userConfig,
  authorization: ["anon"],
};

export default testConfig;
