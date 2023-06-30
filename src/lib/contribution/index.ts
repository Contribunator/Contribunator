import { BiGitPullRequest } from "react-icons/bi";

import type {
  ContributionConfig,
  ContributionOptions,
  Repo,
  TailwindColor,
} from "@/types";

import generateSchema from "./schema";
import prMetadata from "./prMetadata";

export default function contribution({
  title,
  description,
  color,
  icon,
  hidden,
  load,
}: ContributionOptions): ContributionConfig {
  // we return an object that contains inexpensive metadata
  // and a function that can be used to load the contribution
  const contributionConfig = {
    title: title || "Contribution",
    description: description || "A Generic Contribution",
    color: color || ("slate" as TailwindColor),
    icon: icon || BiGitPullRequest,
    hidden,
  };
  return {
    ...contributionConfig,
    // this allows us to use dynamic imports
    // and allows rendering metadata without expense
    load: async (name: string, repoConfig: Repo) => {
      // todo pass the whole config?
      const config = {
        prMetadata,
        imagePath: "media/",
        ...contributionConfig,
        ...(await load(name, repoConfig)),
        name,
      };
      return {
        ...config,
        schema: generateSchema(config, repoConfig),
      };
    },
  };
}
