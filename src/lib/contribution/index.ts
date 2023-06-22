import { BiGitPullRequest } from "react-icons/bi";

import type {
  ContributionLoader,
  ContributionOptions,
  Repo,
  TailwindColor,
} from "@/types";

import generateSchema from "./schema";
import prMetadata from "./prMetadata";

export default function contribution(
  options: ContributionOptions
): ContributionLoader {
  return (name: string, repo: Repo) => {
    const config = {
      name,
      title: "Contribution",
      description: "A Generic Contribution",
      color: "slate" as TailwindColor,
      icon: BiGitPullRequest,
      ...options,
    };
    return {
      ...config,
      schema: generateSchema(config, repo),
      prMetadata: config.prMetadata || prMetadata(config),
    };
  };
}
