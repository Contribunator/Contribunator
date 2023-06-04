import slugify from "@/lib/slugify";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";

import prMetadata from "./prMetadata";
import getImageType from "@/lib/getImageType";

// returns the tweet formatted for twitter-together and github PR
export default async function transformTweetToPR({
  body,
  timestamp,
}: TransformInputs): Promise<TransformOutputs> {
  const { title } = prMetadata(body);
  const media: { [key: string]: string } = {};
  const hasQuote = body.quoteType && body.quoteUrl;
  const hasMedia = body.media && body.media.filter((m: string) => m).length > 0;
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
  .map((m: string, i: number) => {
    // if empty string, skip
    if (!m) {
      return "";
    } else {
      const altText = body.alt_text_media?.[i] || "";
      const fileName = slugify(`${timestamp} ${title} ${altText}`, {
        append: i, // does not append if i is 0
      });
      const fileType = getImageType(m);
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
}
