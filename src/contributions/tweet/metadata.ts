import slugify from "slugify";

// TODO add typing

export function title(body: any) {
  let name = "";
  if (body.quoteType && body.quoteUrl) {
    name += `${body.quoteType} ${body.quoteUrl.split("/")[3]} `;
  }
  // TODO poll, etc.
  if (body.text) {
    // strip url fluff and periods
    const sanitized = body.text.replace(/https?:\/\/([^\/\s]+)(\/\S*)?/g, "$1");
    name += slugify(sanitized, { lower: true, remove: /[^a-zA-Z0-9-. ]/g })
      .split("-")
      .slice(0, 10)
      .join(" ");
  }
  return `tweet: ${name.trim()}`.trim();
}

export function message(body: any) {
  let message = "This Pull Request creates a new";
  const mediaCount = body.media && body.media.filter((m: string) => m).length;
  if (body.quoteType && body.quoteUrl) {
    message += ` ${body.quoteType} ${
      body.quoteType === "retweet" ? "of" : "to"
    } ${body.quoteUrl}`;
  } else {
    message += ` ${mediaCount === 0 ? "text-only " : ""}tweet`;
  }
  if (mediaCount) {
    message += ` with ${mediaCount} image${mediaCount > 1 ? "s" : ""}`;
  }
  message += ".";
  if (!body.text) {
    message += `\n\nThere is no text in the tweet.`;
  }
  return message;
}
