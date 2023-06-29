import { FaTwitter } from "react-icons/fa";

import type {
  ContributionConfig,
  ContributionMeta,
  DeepPartial,
  Form,
} from "@/types";

import contribution from "@/lib/contribution";

export type TweetConfigInput = Partial<ContributionMeta> & {
  form?: DeepPartial<Form>;
  options?: {
    media?: boolean;
    retweet?: boolean;
    reply?: boolean;
    retweetTextRequired?: boolean;
  };
};

export default function tweet(opts: TweetConfigInput = {}): ContributionConfig {
  const { options, form, ...rest } = opts;
  return contribution({
    title: "Tweet",
    description: "Submit a Tweet to be tweeted on this account if approved",
    icon: FaTwitter,
    color: "blue",
    ...rest,
    load: async () => {
      return (await import("./tweet.loader")).default(opts);
    },
  });
}
