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

// returns the tweet formatted for twitter-together and github PR
function transformTweet(obj: any, prefix: string = "[timestamp]") {
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
  if (obj.text) {
    transformed += obj.text;
  }
  const tweet = transformed.trim();
  const branch = `${prefix}-${slugify(name)}`;
  return {
    tweet,
    name,
    media,
    branch,
    files: { ...media, [`tweets/${branch}.tweet`]: tweet },
  };
}

export default transformTweet;
