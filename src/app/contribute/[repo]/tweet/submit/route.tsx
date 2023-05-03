import { createPullRequest } from "@/octokit";
import { NextResponse } from "next/server";
import sharp from "sharp";
import tweetValidation from "../validation";

// TODO do some auth middlewhere somewhere

export async function POST(
  req: Request,
  { params: { repo } }: { params: { repo: string } }
) {
  // let's call octokit
  const body = await req.json();
  console.log(body, repo);

  // validate the request
  const validBody = await tweetValidation.validate(body);
  console.log({ validBody });

  return NextResponse.json({ ok: true });

  // TODO build the tweet as per twitter-together...
  const files: { [key: string]: string } = {
    "tweet.md": `I am a new tweet ${body.text} ${new Date().getTime()}`,
  };

  if (body.media && body.media[0]) {
    // TODO serverside option to downscale image if too big?
    const mediaBuf = Buffer.from(body.media[0].split(",")[1], "base64");
    const convertedBuf = await sharp(mediaBuf).toFormat("jpg").toBuffer();
    files["cat.jpg"] = convertedBuf.toString("base64");
  }

  const pullRequestURL = await createPullRequest({
    repo,
    type: "test",
    description: "Testing",
    files,
  });
  // console.log(res);
  // const pullRequestURL = "https://url.com";
  return NextResponse.json({ pullRequestURL });
}
