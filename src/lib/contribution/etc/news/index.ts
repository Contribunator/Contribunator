import { HiNewspaper } from "react-icons/hi";

import type { ContributionCommonOptions, ContributionConfig } from "@/types";

import contribution from "@/lib/contribution";

export type NewsOptions = ContributionCommonOptions & {
  options: {
    collectionPath: string;
  };
};

export default function news(opts: NewsOptions): ContributionConfig {
  return contribution({
    title: "News Item",
    description: "A link to an article on an external website",
    icon: HiNewspaper,
    color: "green",
    ...opts,
    load: async () => (await import("./news.loader")).default(opts),
  });
}
