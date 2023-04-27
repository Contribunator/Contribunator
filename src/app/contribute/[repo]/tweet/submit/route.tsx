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
  const pullRequestURL = await createPullRequest({
    repo,
    type: "test",
    description: "My Tweet",
    files: {
      "tweet.md": `I am a new tweet ${body.text} ${new Date().getTime()}`,
    },
  });
  // console.log(res);
  return NextResponse.json({ pullRequestURL });
}
