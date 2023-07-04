import { HiVideoCamera } from "react-icons/hi";

import type { ContributionCommonOptions, ContributionConfig } from "@/types";

import contribution from "@/lib/contribution";

export type VideoOptions = ContributionCommonOptions & {
  options: {
    collectionPath: string;
  };
};

export default function video(opts: VideoOptions): ContributionConfig {
  return contribution({
    title: "Video",
    description: "A YouTube video link",
    icon: HiVideoCamera,
    color: "red",
    ...opts,
    load: async () => (await import("./video.loader")).default(opts),
  });
}
