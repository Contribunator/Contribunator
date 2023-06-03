import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";

import { Repo, getRepo } from "./config";
import { Authorized } from "./authorize";
import { appId, installationId, privateKey } from "./env";

type CreatePROptions = {
  authorized: Authorized;
  repo: Repo;
  pr: {
    message?: string;
    title: string;
    branch: string;
    files: {
      [key: string]: string;
    };
  };
};

export default async function createPullRequest(
  { authorized, repo, pr: { files, title, branch, message } }: CreatePROptions,
  OctokitModule = Octokit
) {
  const OctokitPlugin = OctokitModule.plugin(commitPlugin);
  const octokit = new OctokitPlugin({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey,
    },
  });

  const prMessage = `${message}${repo.prPostfix}`;
  const githubUser = authorized.type === "github" ? authorized.token : null;
  const commit = {
    repo: repo.name,
    owner: repo.owner,
    branch: `${repo.branchPrefix}${branch}`,
    createBranch: true,
    ...(githubUser && {
      author: {
        name: githubUser.name || githubUser.login,
        email:
          githubUser.email || `${githubUser.login}@users.noreply.github.com`,
      },
    }),
    changes: [
      {
        message: title,
        files,
      },
    ],
  };

  console.log("commit", commit);
  await octokit.rest.repos.createOrUpdateFiles(commit);

  const pr = {
    base: repo.base,
    title,
    repo: repo.name,
    head: commit.branch,
    owner: repo.owner,
    body: prMessage,
  };

  let prOctokit = octokit;

  // create the PR as the user if they are logged in, otherwise as the app
  if (githubUser) {
    prOctokit = new OctokitModule({ auth: githubUser.accessToken });
  }

  console.log("pr", pr);
  const prResponse = await prOctokit.rest.pulls.create(pr);
  // return "test ok";
  return prResponse.data.html_url;
}
