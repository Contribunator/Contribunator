import slugify from "slugify";

import * as generate from "./metadata";
import { TransformInputs } from "@/lib/pullRequestHandler";

// returns the tweet formatted for twitter-together and github PR
export default function transformToPR({ body, timestamp }: TransformInputs) {
  const title = generate.title(body);
  const message = generate.message(body);
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
      const fileName =
        `${timestamp}-` +
        slugify(`${title} ${altText} ${i || ""}`.trim(), {
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
  if (body.text) {
    transformed += body.text;
  }
  const tweet = transformed.trim();
  const branch = `${timestamp}-${slugify(title, { strict: true })}`;
  const data = {
    tweet,
    title,
    media,
    branch,
    files: { ...media, [`tweets/${branch}.tweet`]: tweet },
  };
  return {
    ...data,
    message,
  };
}
