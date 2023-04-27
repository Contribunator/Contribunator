import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // let's call octokit
  const body = await req.json();

  console.log(body)

  return NextResponse.json({ hello: "world" });
}
