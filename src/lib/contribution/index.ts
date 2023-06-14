import { BiGitPullRequest } from "react-icons/bi";

import type { Contribution, ContributionOptions, TailwindColor } from "@/types";

import generateSchema from "./schema";
import prMetadata from "./prMetadata";

export default function contribution(
  options: ContributionOptions
): Contribution {
  const config = {
    title: "Contribution",
    description: "A Generic Contribution",
    color: "red" as TailwindColor,
    icon: BiGitPullRequest,
    ...options,
  };

  return {
    ...config,
    schema: generateSchema(config),
    prMetadata: config.prMetadata || prMetadata(config),
  };
}
