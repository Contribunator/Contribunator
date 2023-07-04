import { FaTwitter } from "react-icons/fa";

import type { ContributionCommonOptions, ContributionConfig } from "@/types";

import contribution from "@/lib/contribution";

export type TweetConfigInput = ContributionCommonOptions & {
  options?: {
    media?: boolean;
    retweet?: boolean;
    reply?: boolean;
    retweetTextRequired?: boolean;
  };
};

export default function tweet(opts: TweetConfigInput = {}): ContributionConfig {
  return contribution({
    title: "Tweet",
    description: "Submit a Tweet to be tweeted on this account if approved",
    icon: FaTwitter,
    color: "blue",
    ...opts,
    load: async () => (await import("./tweet.loader")).default(opts),
  });
}
