import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";

import { getConfig } from "@/util/config";
import { Authorized } from "@/util/authorize";
import { appId, installationId, privateKey } from "@/util/env";

type CreatePROptions = {
  authorized: Authorized;
  pr: {
    repo: string;
    message?: string;
    name: string;
    branch: string;
    files: {
      [key: string]: string;
    };
  };
};

export default async function createPullRequest(
  {
    authorized,
    pr: {
      repo,
      files,
      name: title, // TODO rename this?
      branch,
      message,
    },
  }: CreatePROptions,
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

  const {
    prPostfix,
    repo: { base, branchPrefix, owner },
  } = getConfig(repo);

  const prMessage = `${message || "Automated Pull Request"}${prPostfix}`;
  const githubUser = authorized.type === "github" ? authorized.token : null;
  const commit = {
    repo,
    owner: owner,
    branch: `${branchPrefix}${branch}`,
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
    repo,
    base,
    title,
    head: commit.branch,
    owner: owner,
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
