import * as Yup from "yup";

import twitter from "twitter-text";

import { validImageAlts, validImages } from "@/lib/commonValidation";
import { init } from "next/dist/compiled/@vercel/og/satori";
import { TweetConfig } from "./config";

const schema = {
  media: validImages,
  alt_text_media: validImageAlts,
  quoteType: Yup.string().oneOf(["reply", "retweet"]),
  quoteUrl: Yup.string().when("quoteType", {
    is: (quoteType: string) => !!quoteType, // if quote type is set
    then: (schema) =>
      schema.url("Must be a valid URL").test({
        name: "is-twitter-link",
        test(text, ctx) {
          // TODO fetch from twitter api to validate
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
};

export default function generateSchema(
  config: Omit<TweetConfig, "initialValues" | "schema">
): { schema: any; initialValues: any } {
  // TODO generate the schema and config based on options passed
  return {
    schema,
    initialValues: {
      quoteType: undefined,
      quoteUrl: "",
      text: "",
      media: ["", "", "", ""],
      alt_text_media: ["", "", "", ""],
    },
  };
}
