import slugify from "slugify";

const generateName = (obj: any) => {
  let name = "";
  if (obj.quoteType && obj.quoteUrl) {
    name += `${obj.quoteType} ${obj.quoteUrl.split("/")[3]} `;
  }
  // TODO poll, etc.
  if (obj.text) {
    name += slugify(obj.text, { lower: true, strict: true })
      .split("-")
      .slice(0, 5)
      .join(" ");
  }
  return name.trim() || "tweet";
};

const transformTweet = (obj: any, timestamp: string = "[timestamp]") => {
  const name = generateName(obj);
  const media: { [key: string]: string } = {};
  let transformed = "";
  // todo add other types
  if ((obj.quoteType && obj.quoteUrl) || obj.media) {
    transformed += `---\n`;
    if (obj.quoteType && obj.quoteUrl) {
      transformed += `${obj.quoteType}: ${obj.quoteUrl}\n`;
    }
    if (obj.media) {
      transformed += `media:
  ${obj.media
    .map((m: string, i: number) => {
      if (!m) {
        return "";
      } else {
        const altText = obj.alt_text_media?.[i] || "";
        const fileName =
          `${timestamp}-` +
          slugify(`${name} ${altText} ${i || ""}`.trim(), {
            lower: true,
            strict: true,
          });
        const filePath = `media/${fileName}.jpg`;
        let mediaString = `- file: ${filePath}\n`;
        if (altText) {
          mediaString += `    alt: ${altText}\n`;
        }
        media[filePath] = m;
        return mediaString;
      }
    })
    .filter((m: string) => m)
    .join("  ")}`;
    }
    transformed += `---\n\n`;
  }
  if (obj.text) {
    transformed += obj.text;
  }
  return { tweet: transformed.trim(), name, media };
};

export default transformTweet;
