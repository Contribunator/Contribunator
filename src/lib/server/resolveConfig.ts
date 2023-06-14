import { UserConfig } from "@/types";

// TODO figure out a better way to do this
import getTestConfig from "@/../test/configs/contribunator.config";
import getUserConfig from "@/../contribunator.config";

import { demo, dev, e2e } from "../env";

export default function resolveConfig(): UserConfig {
  if (dev || demo || e2e) {
    return getTestConfig();
  } else {
    return getUserConfig();
  }
}
