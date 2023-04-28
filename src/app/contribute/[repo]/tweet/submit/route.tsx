import { createPullRequest } from "@/octokit";
import { NextResponse } from "next/server";

// TODO do some auth middlewhere somewhere

export async function POST(
  req: Request,
  { params: { repo } }: { params: { repo: string } }
) {
  // let's call octokit
  const body = await req.json();
  console.log(body, repo);
  // TODO use validation schema here
  // TODO build the tweet as per twitter-together...
  // const pullRequestURL = await createPullRequest({
  //   repo,
  //   type: "test",
  //   description: "My Tweet",
  //   files: {
  //     "tweet.md": `I am a new tweet ${body.text} ${new Date().getTime()}`,
  //   },
  // });
  // console.log(res);
  const pullRequestURL = "https://url.com"
  return NextResponse.json({ pullRequestURL });
}
