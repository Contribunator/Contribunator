import slugify from "@/lib/helpers/slugify";

import type { Image, PrMetadata } from "@/types";

const tweetPrMetadata: PrMetadata = ({
  data,
}: {
  data: {
    media?: Image[];
    quoteType?: string;
    quoteUrl?: string;
    text?: string;
  };
}) => {
  // todo poll, etc.
  const mediaCount = data.media?.length;

  let title = data.quoteType || "tweet";

  if (data.quoteType && data.quoteUrl) {
    title += " " + data.quoteUrl.split("/")[3];
  }

  if (mediaCount) {
    title += " with media";
  }

  if (data.text) {
    title += " " + data.text;
  }

  title = "Add " + slugify(title, { join: " " });

  let message = "This Pull Request creates a new";

  if (data.quoteType && data.quoteUrl) {
    message += ` ${data.quoteType} ${
      data.quoteType === "retweet" ? "of" : "to"
    } ${data.quoteUrl}`;
  } else {
    message += " tweet";
  }

  if (mediaCount) {
    message += ` with ${mediaCount} image${mediaCount > 1 ? "s" : ""}`;
  }

  message += ".";

  if (!data.text) {
    message += `\n\nThere is no text in the tweet.`;
  }

  return { title, message };
};

export default tweetPrMetadata;
