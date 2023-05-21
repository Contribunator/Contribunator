import * as Yup from "yup";

import twitter from "twitter-text";

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
  // TODO move this into a generic schema option
  media: Yup.array().of(
    Yup.string().test({
      name: "is-valid-media",
      test(data = "", ctx) {
        if (data === "") {
          return true;
        }
        if (data === "editing") {
          return ctx.createError({
            message: "Please complete crop selection",
          });
        }
        if (
          data.match(
            /^data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
          )
        ) {
          return true;
        }
        return ctx.createError({
          message: "Invalid image data",
        });
      },
    })
  ),
  alt_text_media: Yup.array().of(
    Yup.string().max(999, "Must be less than 1,000 characters")
  ),
  quoteType: Yup.string().oneOf(["reply", "retweet"]),
  // TODO fetch from twitter api to validate
  quoteUrl: Yup.string().when("quoteType", {
    is: (quoteType: string) => !!quoteType, // if quote type is set
    then: (schema) =>
      schema
        .required("Required")
        .url("Must be a valid URL")
        .test({
          name: "is-twitter-link",
          test(text, ctx) {
            const regexPattern =
              /https:\/\/twitter\.com\/([\w]+)\/status\/(\d+)/;
            if (!text || !text.match(regexPattern)) {
              return ctx.createError({
                message:
                  "Must match format https://twitter.com/[user]/status/[id]",
              });
            }
            return true;
          },
        }),
  }),
};

export default tweetSchema;
