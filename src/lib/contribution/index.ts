import { BiGitPullRequest } from "react-icons/bi";
import mergeWith from "lodash/mergeWith";

import type {
  Contribution,
  ContributionAsync,
  ContributionConfig,
  ContributionOptions,
  ContributionSync,
  Repo,
  TailwindColor,
} from "@/types";

import generateSchema from "./schema";
import prMetadata from "./prMetadata";

export default function contribution(
  options: ContributionOptions
): ContributionConfig {
  const { title, description, color, icon, hidden } = options;
  // we return an object that contains inexpensive metadata
  // and a function that can be used to load the contribution
  const meta = {
    title: title || "Contribution",
    description: description || "A Generic Contribution",
    color: color || ("slate" as TailwindColor),
    icon: icon || BiGitPullRequest,
    hidden,
  };

  return {
    ...meta,
    // this optionally allows us to use dynamic imports
    // and allows getting metadata without expense
    load: async (name: string, repoConfig: Repo): Promise<Contribution> => {
      const baseConfig = {
        prMetadata,
        imagePath: "media/",
        ...meta,
        name,
      };
      // load the config
      const loaded = {
        ...baseConfig,
        ...(await (async () => {
          if ("load" in options) {
            const loaded = await (options as ContributionAsync).load();
            return "default" in loaded ? await loaded.default() : loaded;
          }
          return options as ContributionSync;
        })()),
      };
      // load the form overrides if passed
      const config = {
        ...loaded,
        form: mergeWith(
          loaded.form,
          await (async () => options.form || {})(),
          (objValue: unknown, srcValue: unknown) => {
            // replace arrays entirely (tags, suggestions)
            if (srcValue && Array.isArray(objValue)) {
              return srcValue;
            }
          }
        ),
      };

      // generate schema
      return {
        ...config,
        schema: generateSchema(config, repoConfig),
      };
    },
  };
}
