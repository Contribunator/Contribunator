import { createPullRequest } from "@/github";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import validateTweet from "../validateTweet";
import transformTweet from "../transformTweet";
import authorize from "@/authorize";

dayjs.extend(utc);

export async function POST(
  req: NextRequest,
  { params: { repo } }: { params: { repo: string } }
) {
  const authorized = await authorize(req);
  const body = await req.json();
  const validBody = await validateTweet.validate(body);
  const timeStamp = dayjs().utc().format("YYMMDD-HHmm");
  const { files, name, media, branch } = transformTweet(validBody, timeStamp);

  // convert media
  await Promise.all(
    Object.keys(media).map(async (fileName) => {
      try {
        const start = new Date().getTime();
        const fileType = fileName.split(".").pop() as "png" | "jpg";
        const mediaBuf = Buffer.from(media[fileName].split(",")[1], "base64");
        // TODO make max width configurable
        const convertedBuf = await sharp(mediaBuf)
          .resize({ withoutEnlargement: true, width: 1600 })
          .toFormat(fileType)
          .toBuffer();
        files[fileName] = convertedBuf.toString("base64");
        const taken = new Date().getTime() - start;
        console.log(`converted in ${taken}ms ${fileName}`);
      } catch (e) {
        console.log("Errorr converting", fileName);
        throw e;
      }
    })
  );

  const prUrl = await createPullRequest(authorized, {
    repo,
    branch,
    name,
    files,
  });

  console.log("created pr", prUrl);
  return NextResponse.json({ prUrl });
}
