import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";

import { getRepoConfig } from "@/config";
import { Authorized } from "./authorize";

const OctokitPlugin = Octokit.plugin(commitPlugin);

const octokit = new OctokitPlugin({
  authStrategy: createAppAuth,
  auth: {
    appId: parseInt(process.env.GITHUB_APP_ID as string),
    installationId: parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string),
    privateKey: process.env.GITHUB_APP_PK as string,
  },
});

export async function createPullRequest(
  { token }: Authorized,
  {
    repo,
    files,
    name,
    branch,
  }: {
    repo: string;
    name: string;
    branch: string;
    files: {
      [key: string]: string;
    };
  }
) {
  const { base, branchPrefix, owner } = await getRepoConfig(repo);

  const message = `Add ${name}`;

  const commit = {
    repo,
    owner: owner,
    branch: `${branchPrefix}${branch}`,
    createBranch: true,
    ...(token && {
      name: token.name || token.login,
      email: `${token.login}@users.noreply.github.com`,
    }),
    changes: [
      {
        message,
        files,
      },
    ],
  };

  console.log("commit", commit);
  await octokit.rest.repos.createOrUpdateFiles(commit);

  const pr = {
    repo,
    base,
    head: commit.branch,
    owner: owner,
    title: message,
    body: `This PR was created by a bot, todo some message...`,
  };

  // create the PR as the user if they are logged in
  let prOctokit = octokit;

  if (token) {
    prOctokit = new OctokitPlugin({
      auth: token.accessToken,
    });
  }

  console.log("pr", pr);
  const prResponse = await prOctokit.rest.pulls.create(pr);

  return prResponse.data.html_url;
}
