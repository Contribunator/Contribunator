import * as Yup from "yup";

import twitter from "twitter-text";

import { validImageAlts, validImages } from "@/lib/commonValidation";

const tweetSchema = {
  text: Yup.string()
    .test({
      name: "is-valid-tweet-text",
      test(text = "", ctx) {
        if (text === "") {
          return true;
        }
        if (text.includes("---")) {
          return ctx.createError({
            message: "Do not include `---`",
          });
        }
        const tweet = twitter.parseTweet(text);
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
          quoteType !== "retweet" && (media || []).filter((m) => m).length === 0
        );
      },
      then: (schema) =>
        schema.required("Required unless retweeting or uploading images"),
    }),
  media: validImages,
  alt_text_media: validImageAlts,
  quoteType: Yup.string().oneOf(["reply", "retweet"]),
  // TODO fetch from twitter api to validate
  quoteUrl: Yup.string().when("quoteType", {
    is: (quoteType: string) => !!quoteType, // if quote type is set
    then: (schema) =>
      schema.url("Must be a valid URL").test({
        name: "is-twitter-link",
        test(text, ctx) {
          if (!text) {
            return ctx.createError({
              message: `Required ${ctx.parent.quoteType} URL`,
            });
          }
          const regexPattern = /https:\/\/twitter\.com\/([\w]+)\/status\/(\d+)/;
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
};

export default tweetSchema;
