import { FaTwitter } from "react-icons/fa";

import type { ContributionConfig, ContributionMeta, Form, Text } from "@/types";

import contribution from "@/lib/contribution";

export type TweetConfigInput = Partial<ContributionMeta> & {
  form?: Partial<Omit<Form, "fields">> & {
    fields?: {
      text?: Partial<Omit<Text, "type">>;
    };
  };
};

export default function tweet(opts: TweetConfigInput): ContributionConfig {
  return contribution({
    title: "Tweet",
    description: "Submit a Tweet to be tweeted on this account if approved",
    icon: FaTwitter,
    color: "blue",
    ...opts,
    load: async () => {
      return (await import("./tweet.loader")).default(opts);
    },
  });
}
