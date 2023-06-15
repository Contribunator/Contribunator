import { BiGitPullRequest } from "react-icons/bi";

import type {
  Config,
  ContributionLoader,
  ContributionOptions,
  TailwindColor,
} from "@/types";

import generateSchema from "./schema";
import prMetadata from "./prMetadata";

export default function contribution(
  options: ContributionOptions
): ContributionLoader {
  const config = {
    title: "Contribution",
    description: "A Generic Contribution",
    color: "red" as TailwindColor,
    icon: BiGitPullRequest,
    ...options,
  };

  return (appConfig: Config) => {
    return {
      ...config,
      schema: generateSchema(config, appConfig),
      prMetadata: config.prMetadata || prMetadata(config),
    };
  };
}
