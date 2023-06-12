import * as Yup from "yup";
import { FaTwitter } from "react-icons/fa";
import twitterText from "twitter-text";

import genericConfig, {
  ExtendedGenericInput,
  GenericConfig,
} from "@/contributions/generic/config";

import suggestions, { Suggestion } from "./tweet.suggestions";
import prMetadata from "./tweet.prMetadata";
import commit from "./tweet.commit";

export type TweetConfigInput = ExtendedGenericInput & {
  options?: {
    fields?: {
      text?: {
        placeholder?: string;
        tags?: string[];
        suggestions?: Suggestion[];
      };
    };
  };
};

export default function tweetConfig(
  opts: TweetConfigInput = {}
): GenericConfig {
  // TODO options for disallowing media etc.
  return genericConfig({
    title: "Generic Tweet",
    description: "Recreate Tweet with Generic",
    icon: FaTwitter,
    color: "blue",
    ...opts,
    prMetadata,
    options: {
      ...opts.options,
      commit,
      fields: {
        quoteType: {
          type: "choice",
          title: "Quote Type",
          as: "buttons",
          unset: "None",
          options: {
            retweet: {
              title: "Retweet",
            },
            reply: {
              title: "Reply",
            },
          },
        },
        quoteUrl: {
          type: "text",
          title: "Quote URL",
          placeholder: "e.g. https://twitter.com/[user]/status/[id]",
          transform: (value) => value.split("?")[0].trim(),
          iframe: ({ field, meta }) => {
            if (!field.value || meta.error) return null;
            const encodedUrl = encodeURIComponent(field.value);
            return `https://twitframe.com/show?url=${encodedUrl}`;
          },
          visible: ({ formik }) => !!formik.values.quoteType,
          validation: {
            yup: Yup.string().when("quoteType", {
              is: (quoteType: string) => !!quoteType, // if quote type is set
              then: (schema) =>
                schema.url("Must be a valid URL").test({
                  test(text, ctx) {
                    // TODO fetch from twitter api to validate
                    if (!text) {
                      return ctx.createError({
                        message: `Required ${ctx.parent.quoteType} URL`,
                      });
                    }
                    const regexPattern =
                      /https:\/\/twitter\.com\/([\w]+)\/status\/(\d+)/;
                    if (!text || !text.match(regexPattern)) {
                      return ctx.createError({
                        message:
                          "Must match format https://twitter.com/[user]/status/[id]",
                      });
                    }
                    // TODO automatically transform this for easier API usage?
                    if (text.includes("?")) {
                      return ctx.createError({
                        message: "Remove query params (?s=x&t=y) from the URL",
                      });
                    }
                    return true;
                  },
                }),
            }),
          },
        },
        text: {
          type: "text",
          as: "textarea",
          title: "Tweet Text",
          placeholder: "Enter tweet text here",
          suggestions: suggestions(),
          tags: ["👀", "😂", "✨", "🔥", "💪", "#twitter", "#memes", "#love"],
          ...opts.options?.fields?.text,
          // placeholder: "e.g. The Best Website Ever",
          validation: {
            yup: Yup.string()
              .test({
                test(text = "", ctx) {
                  if (text === "") {
                    return true;
                  }
                  if (text.includes("---")) {
                    return ctx.createError({
                      message: "Do not include `---`",
                    });
                  }
                  const tweet = twitterText.parseTweet(text);
                  if (!tweet.valid) {
                    return ctx.createError({
                      message: "Tweet is too long",
                    });
                  }
                  return true;
                },
              })
              .when(["media", "quoteType"], {
                is: (media: string[], quoteType: string) => {
                  return (
                    quoteType !== "retweet" &&
                    (media || []).filter((m) => m).length === 0
                  );
                },
                then: (schema) =>
                  schema.required(
                    "Required unless retweeting or uploading images"
                  ),
              }),
          },
        },
        media: {
          type: "images",
          title: "Upload Images",
          alt: true,
        },
      },
    },
  });
}
