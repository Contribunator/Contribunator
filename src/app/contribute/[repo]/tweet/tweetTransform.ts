import slugify from "slugify";

// TODO add typing

const generateName = (obj: any) => {
  let name = "";
  if (obj.quoteType && obj.quoteUrl) {
    name += `${obj.quoteType} ${obj.quoteUrl.split("/")[3]} `;
  }
  // TODO poll, etc.
  if (obj.text) {
    // strip url fluff and periods
    const sanitized = obj.text.replace(/https?:\/\/([^\/\s]+)(\/\S*)?/g, "$1");
    name += slugify(sanitized, { lower: true, remove: /[^a-zA-Z0-9-. ]/g })
      .split("-")
      .slice(0, 10)
      .join(" ");
  }
  return `tweet: ${name.trim()}`.trim();
};

const generateMessage = (obj: any) => {
  let message = "This Pull Request creates a new";
  const mediaCount = obj.media && obj.media.filter((m: string) => m).length;
  if (obj.quoteType && obj.quoteUrl) {
    message += ` ${obj.quoteType} ${
      obj.quoteType === "retweet" ? "of" : "to"
    } ${obj.quoteUrl}`;
  } else {
    message += ` ${mediaCount === 0 ? "text-only " : ""}tweet`;
  }
  if (mediaCount) {
    message += ` with ${mediaCount} image${mediaCount > 1 ? "s" : ""}`;
  }
  message += ".";
  if (!obj.text) {
    message += `\n\nThere is no text in the tweet.`;
  }
  return message;
};

// returns the tweet formatted for twitter-together and github PR
function tweetTransform(obj: any, prefix: string = "[timestamp]") {
  const name = generateName(obj);
  const media: { [key: string]: string } = {};
  const hasQuote = obj.quoteType && obj.quoteUrl;
  const hasMedia = obj.media && obj.media.filter((m: string) => m).length > 0;
  let transformed = "";
  // HEADER START: todo add other types
  if (hasQuote || hasMedia) {
    transformed += `---\n`;
    if (hasQuote) {
      transformed += `${obj.quoteType}: ${obj.quoteUrl}\n`;
    }
    if (hasMedia) {
      transformed += `media:
${obj.media
  .map((m: string, i: number) => {
    // if empty string, skip
    if (!m) {
      return "";
    } else {
      const altText = obj.alt_text_media?.[i] || "";
      const fileName =
        `${prefix}-` +
        slugify(`${name} ${altText} ${i || ""}`.trim(), {
          lower: true,
          strict: true,
        });
      // infer type from data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
      const fileType = m.split(";")[0].split("/")[1] === "png" ? "png" : "jpg";
      const filePath = `${fileName}.${fileType}`;
      const fileDest = `media/${filePath}`;
      let mediaString = `  - file: ${filePath}\n`;
      if (altText) {
        mediaString += `    alt: ${altText}\n`;
      }
      media[fileDest] = m;
      return mediaString;
    }
  })
  .filter((m: string) => m)
  .join("")}`;
    }
    transformed += `---\n\n`;
  }
  // HEADER END
  if (obj.text) {
    transformed += obj.text;
  }
  const tweet = transformed.trim();
  const branch = `${prefix}-${slugify(name, { strict: true })}`;
  const data = {
    tweet,
    name,
    media,
    branch,
    files: { ...media, [`tweets/${branch}.tweet`]: tweet },
  };
  const message = generateMessage(obj);
  return {
    ...data,
    message,
  };
}

export default tweetTransform;
