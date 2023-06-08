import { TransformToPR } from "@/lib/pullRequestHandler";
import slugify from "@/lib/slugify";
import prMetadata from "./tweet.prMetadata";

type Image = {
  data: string;
  alt?: string;
  type: string;
};

export const tweetCommit: TransformToPR = async ({ body, timestamp }) => {
  const { title } = prMetadata(body);
  const media: { [key: string]: string } = {};
  const hasQuote = body.quoteType && body.quoteUrl;
  const hasMedia = body.media && body.media.length > 0;
  let transformed = "";
  // HEADER START: todo add other types
  if (hasQuote || hasMedia) {
    transformed += `---\n`;
    if (hasQuote) {
      transformed += `${body.quoteType}: ${body.quoteUrl}\n`;
    }
    if (hasMedia) {
      transformed += `media:
${body.media
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
  if (body.text) {
    transformed += body.text;
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
