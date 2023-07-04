import { HiCursorClick } from "react-icons/hi";

import type { ContributionCommonOptions, ContributionConfig } from "@/types";

import contribution from "@/lib/contribution";

export type AppOptions = ContributionCommonOptions & {
  options: {
    relativeImagePath: string;
    collectionPath: string;
    absoluteImagePath: string;
  };
};

export default function app(opts: AppOptions): ContributionConfig {
  return contribution({
    title: "App",
    description: "Submit a new application",
    icon: HiCursorClick,
    color: "purple",
    ...opts,
    load: async () => (await import("./app.loader")).default(opts),
  });
}
