import { createPullRequest } from "@/octokit";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tweetValidation from "../validation";
import transformTweet from "../transform";
import { getToken } from "next-auth/jwt";

dayjs.extend(utc);

export async function POST(
  req: NextRequest,
  { params: { repo } }: { params: { repo: string } }
) {
  // TODO move this to some middlewhere somewhere, or maybe a hook
  const token = (await getToken({ req })) as {
    login: string;
    accessToken: string;
    name: string;
  };

  // if (!token || !token.login || !token.accessToken) {
  //   return NextResponse.json(
  //     { error: "You must be logged in" },
  //     { status: 401 }
  //   );
  // }
  // // const userEmail = token.login;
  // console.log({ token });
  // return NextResponse.json({ pullRequestURL: "https://test.com" });

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
      const fileType = fileName.split(".").pop() as "png" | "jpg";
      const mediaBuf = Buffer.from(media[fileName].split(",")[1], "base64");
      const convertedBuf = await sharp(mediaBuf)
        // TODO make max width configurable
        .resize({ withoutEnlargement: true, width: 1600 })
        .toFormat(fileType)
        .toBuffer();
      files[fileName] = convertedBuf.toString("base64");
      console.log("converted!");
    })
  );

  const prUrl = await createPullRequest({
    repo,
    branch,
    name,
    files,
    token,
  });

  console.log("created pr", prUrl);
  return NextResponse.json({ prUrl });
}
