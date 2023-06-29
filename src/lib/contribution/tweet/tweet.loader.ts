import { ContributionLoaded, Form } from "@/types";
import mergeWith from "lodash/mergeWith";

import { string } from "yup";
import twitterText from "twitter-text";

import suggestions from "./tweet.suggestions";
import prMetadata from "./tweet.prMetadata";
import commit from "./tweet.commit";
import { TweetConfigInput } from ".";

export default function tweetConfig({
  options = {},
  form = {},
}: TweetConfigInput = {}): ContributionLoaded {
  const {
    retweetTextRequired = false,
    // TODO
    // media = true,
    // retweet = true,
    // reply = true,
  } = options;

  // deep merge form and form options
  const formDefaults: Form = {
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
          yup: string().when("quoteType", {
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
                  // TODO automatically transform this serverside for easier API usage?
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
        placeholder: "Tweet Text Here",
        suggestions: suggestions(),
        tags: ["👀", "😂", "✨", "🔥", "💪", "#twitter", "#memes", "#love"],
        validation: {
          yup: string()
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
                if (quoteType === "retweet" && retweetTextRequired) {
                  return true;
                }
                if (quoteType === "reply") {
                  return true;
                }
                if (!quoteType && !media) {
                  return true;
                }
                return false;
              },
              then: (schema) =>
                schema.required(
                  retweetTextRequired
                    ? "Required unless uploading images"
                    : "Required unless retweeting or uploading images"
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
  };

  return {
    prMetadata,
    commit,
    form: mergeWith(
      formDefaults,
      form,
      (objValue: unknown, srcValue: unknown) => {
        // replace arrays entirely (tags, suggestions)
        if (srcValue && Array.isArray(objValue)) {
          return srcValue;
        }
      }
    ),
  };
}
