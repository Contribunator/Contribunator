import { createPullRequest } from "@/octokit";
import { NextResponse } from "next/server";
import sharp from "sharp";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tweetValidation from "../validation";
import transformTweet from "../transform";

dayjs.extend(utc);

export async function POST(
  req: Request,
  { params: { repo } }: { params: { repo: string } }
) {
  // TODO do some auth middlewhere somewhere
  // TODO CAPTCHA
  const body = await req.json();

  // validate the request
  const validBody = await tweetValidation.validate(body);

  const timeStamp = dayjs().utc().format("YYMMDD-HHmm");

  const { files, name, media, branch } = transformTweet(validBody, timeStamp);

  // convert media
  await Promise.all(
    Object.keys(media).map(async (fileName) => {
      console.log("converting", fileName);
      const mediaBuf = Buffer.from(media[fileName].split(",")[1], "base64");
      // max width of 1600 px
      const convertedBuf = await sharp(mediaBuf)
        .resize({ withoutEnlargement: true, width: 1600 })
        // TODO have this be set based on the original filetype
        .toFormat("jpg")
        .toBuffer();
      files[fileName] = convertedBuf.toString("base64");
      console.log("converted!");
    })
  );

  const pullRequestURL = await createPullRequest({
    repo,
    branch,
    name,
    files,
  });

  console.log("created pr", pullRequestURL);
  return NextResponse.json({ pullRequestURL });
}
