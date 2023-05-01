import * as Yup from "yup";

/*
types:

- simple (text)
- retweet (quote = retweet)
- reply (quote = reply)

- vnext media
- vnext poll
- vnext thread
*/

// text must exist if retweet not set
// validate qutoe tweet

// TODO dry out global options

const validationSchema = Yup.object({
  text: Yup.string()
    // TODO use https://github.com/twitter/twitter-text
    // TODO ensure it doesn't include `---` or other twitter-together specific things
    // .max(3, "Must be 3 characters or less")
    .max(280, "Must be 280 characters or less")
    .when("quoteType", {
      is: (quoteType: string) => quoteType != "retweet",
      then: (schema) => schema.required("Required unless retweeting"),
    }),
  quoteType: Yup.string().oneOf(["reply", "retweet"]), // todo validate twitter URL
  // type if quote is set
  quoteUrl: Yup.string()
    .url("Must be a valid URL")
    .test({
      name: "is-twitter",
      test(text, ctx) {
        const regexPattern = /https:\/\/twitter\.com\/([\w]+)\/status\/(\d+)/;
        if (!text || !text.match(regexPattern)) {
          return ctx.createError({
            message: "Must match format https://twitter.com/[user]/status/[id]",
          });
        }
        return true;
      },
    })
    .when("quoteType", {
      is: (quoteType: string) => !!quoteType, // if quote type is set
      then: (schema) => schema.required("Required"),
    }), // TODO valdiate the URL is a tweet, grab the tweet
});

export default validationSchema;
