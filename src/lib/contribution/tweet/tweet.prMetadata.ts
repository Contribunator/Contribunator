import slugify from "@/lib/helpers/slugify";

import type { PrMetadata } from "@/types";

const tweetPrMetadata: PrMetadata = (body) => {
  // todo poll, etc.
  const mediaCount = body.media && body.media.filter((m: string) => m).length;

  let title = body.quoteType || "tweet";

  if (body.quoteType && body.quoteUrl) {
    title += " " + body.quoteUrl.split("/")[3];
  }

  if (mediaCount) {
    title += " with media";
  }

  if (body.text) {
    title += " " + body.text;
  }

  title = "Add " + slugify(title, { join: " ", slice: 10 });

  let message = "This Pull Request creates a new";

  if (body.quoteType && body.quoteUrl) {
    message += ` ${body.quoteType} ${
      body.quoteType === "retweet" ? "of" : "to"
    } ${body.quoteUrl}`;
  } else {
    message += " tweet";
  }

  if (mediaCount) {
    message += ` with ${mediaCount} image${mediaCount > 1 ? "s" : ""}`;
  }

  message += ".";

  if (!body.text) {
    message += `\n\nThere is no text in the tweet.`;
  }

  return { title, message };
};

export default tweetPrMetadata;
