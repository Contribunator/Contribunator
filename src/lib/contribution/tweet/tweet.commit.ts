import slugify from "@/lib/helpers/slugify";
import prMetadata from "./tweet.prMetadata";
import { Commit } from "@/types";

type Image = {
  data: string;
  alt?: string;
  type: string;
};

type Data = {
  media?: Image[];
  quoteType?: string;
  quoteUrl?: string;
  text?: string;
};

const tweetCommit: Commit = async (props) => {
  const { timestamp } = props;
  const data = props.data as Data;
  const { title } = prMetadata(props);
  const media: { [key: string]: string } = {};
  const hasQuote = data.quoteType && data.quoteUrl;
  const hasMedia = data.media && data.media.length > 0;
  let transformed = "";
  // HEADER START: todo add other types
  if (hasQuote || hasMedia) {
    transformed += `---\n`;
    if (hasQuote) {
      transformed += `${data.quoteType}: ${data.quoteUrl}\n`;
    }
    if (data.media && hasMedia) {
      transformed += `media:
${data.media
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
  if (data.text) {
    transformed += data.text;
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
