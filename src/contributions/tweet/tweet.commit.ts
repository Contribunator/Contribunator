import { TransformToPR } from "@/lib/pullRequestHandler";
import slugify from "@/lib/slugify";
import prMetadata from "./tweet.prMetadata";

type Image = {
  data: string;
  alt?: string;
  type: string;
};

export const tweetCommit: TransformToPR = async ({ fields, timestamp }) => {
  const { title } = prMetadata(fields);
  const media: { [key: string]: string } = {};
  const hasQuote = fields.quoteType && fields.quoteUrl;
  const hasMedia = fields.media && fields.media.length > 0;
  let transformed = "";
  // HEADER START: todo add other types
  if (hasQuote || hasMedia) {
    transformed += `---\n`;
    if (hasQuote) {
      transformed += `${fields.quoteType}: ${fields.quoteUrl}\n`;
    }
    if (hasMedia) {
      transformed += `media:
${fields.media
  .map(({ data, alt = "", type }: Image, i: number) => {
    const fileName = slugify(`${timestamp} ${title} ${alt}`, {
      append: i, // does not append if i is 0
    });
    const filePath = `${fileName}.${type}`;
    const fileDest = `media/${filePath}`;
    let mediaString = `  - file: ${filePath}\n`;
    if (alt) {
      mediaString += `    alt: ${alt}\n`;
    }
    media[fileDest] = data;
    return mediaString;
  })
  .join("")}`;
    }
    transformed += `---\n\n`;
  }
  // HEADER END
  if (fields.text) {
    transformed += fields.text;
  }

  const tweetFileName = slugify(`${timestamp} ${title}`);

  return {
    images: media, // these will get converted in pullRequestHandler
    files: {
      [`tweets/${tweetFileName}.tweet`]: transformed.trim(),
    },
  };
};

export default tweetCommit;
