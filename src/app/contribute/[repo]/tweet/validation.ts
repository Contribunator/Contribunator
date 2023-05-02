import * as Yup from "yup";

// TODO ...spread global options
// TODO validate payload size is less than 4.5mb for serverless functions

const tweetValidation = Yup.object({
  text: Yup.string()
    // TODO use https://github.com/twitter/twitter-text
    // TODO ensure it doesn't include `---` or other twitter-together specific things
    // .max(3, "Must be 3 characters or less")
    .max(280, "Must be 280 characters or less")
    .when("quoteType", {
      is: (quoteType: string) => quoteType != "retweet",
      then: (schema) => schema.required("Required unless retweeting"),
    }),
  media: Yup.array(), // TODO validate
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
    }), // TODO valdiate the URL is a tweet, grab the tweet
});

export default tweetValidation;
