import * as Yup from "yup";

// TODO ...spread global options higher up

// TODO allow blank tweet media is set

const tweetValidation = Yup.object({
  text: Yup.string()
    // TODO use https://github.com/twitter/twitter-text
    // TODO ensure it doesn't include `---` or other twitter-together specific things
    // .max(3, "Must be 3 characters or less")
    .max(280, "Must be 280 characters or less")
    .when(["media", "quoteType"], {
      is: (media: string[], quoteType: string) => {
        return (
          quoteType !== "retweet" && (media || []).filter((m) => m).length === 0
        );
      },
      then: (schema) =>
        schema.required("Required unless retweeting or uploading images"),
    }),
  media: Yup.array().of(Yup.string().nullable()), // TODO validate ?
  alt_text_media: Yup.array().of(Yup.string().nullable()), // TODO validate (e.g. max length)
  // TODO
  // file_type_media: Yup.array().of(
  //   Yup.string().oneOf(["jpg", "png"]).nullable()
  // ), // TODO validate
  quoteType: Yup.string().oneOf(["reply", "retweet"]),
  // type if quote is set
  quoteUrl: Yup.string()
    // TODO fetch from twitter api to validate?
    .when("quoteType", {
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
});

export default tweetValidation;
