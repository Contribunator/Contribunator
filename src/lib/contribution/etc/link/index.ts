import { HiLink } from "react-icons/hi";

import type { ContributionCommonOptions, ContributionConfig } from "@/types";

import contribution from "@/lib/contribution";

// TODO load the categories dynamically

type CatItem = {
  title?: string;
  sourcePath?: string;
  showIcons?: boolean;
  showDescription?: boolean;
  sourceKey?: string;
  keyMap?: { [key: string]: string };
  [key: string]: CatItem | string | boolean | undefined;
};

export type CatMap = {
  [key: string]: CatItem;
};

export type LinkOptions = ContributionCommonOptions & {
  options: {
    categories: CatMap;
    keyMap?: { [key: string]: string };
  };
};

export default function link(opts: LinkOptions): ContributionConfig {
  return contribution({
    title: "Link",
    description: "Add links to a website",
    icon: HiLink,
    color: "yellow",
    ...opts,
    load: async () => (await import("./link.loader")).default(opts),
  });
}
