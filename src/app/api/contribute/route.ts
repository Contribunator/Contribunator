//  TODO, check for session OR API key
// TODO if no email found, should use login@users.noreply.github.com

import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { githubConfig } from "../config";

interface File {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "commit" | "tree" | "blob";
  sha?: string | null;
  content: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  // // Do we ever need to do this? Perhaps only for PRs, but they can be done by the bot also.
  const client = new Octokit({
    authStrategy: createAppAuth,
    auth: githubConfig,
    // auth: token.accessToken
  });

  const repoConf = {
    owner: "Contribunator",
    repo: "Sample",
  };

  // START GIT STUFF

  // FETCH
  const commits = await client.repos.listCommits(repoConf);
  const headCommitSHA = commits.data[0].sha;

  // PREPARE
  const files = [
    {
      name: "test.md",
      contents: "Hello World",
    },
    {
      name: "time.txt",
      contents: new Date().toString(),
    },
  ];

  const commitableFiles: File[] = files.map(({ name, contents }) => {
    return {
      path: name,
      mode: "100644",
      type: "commit",
      content: contents,
    };
  });

  // CHECKOUT
  const {
    data: { sha: currentTreeSHA },
  } = await client.git.createTree({
    ...repoConf,
    tree: commitableFiles,
    base_tree: headCommitSHA,
    message: "Updated programatically with Octokit",
    parents: [headCommitSHA],
  });

  // COMMIT
  const {
    data: { sha: newCommitSHA },
  } = await client.git.createCommit({
    ...repoConf,
    tree: currentTreeSHA,
    author: {
      name: "Istora Mandiri",
      email: "IstoraMandiri@users.noreply.github.com",
    },
    message: `Updated programatically with Octokit`,
    parents: [headCommitSHA],
  });

  // PUSH
  // TODO make sure ref does not exist...
  await client.git.createRef({
    ...repoConf,
    sha: newCommitSHA,
    ref: `refs/heads/contribunator/le-new`,
  });

  // PULL REQUEST

  // now just make a new PR with this commit.
  // something like
  // const { data } = await client.rest.issues.create({
  //   owner: 'Contribunator',
  //   repo: 'Sample',
  //   title: body.first,
  //   body: body.last,
  // });

  return NextResponse.json({ message: "Success" });
}
