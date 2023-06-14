import { createAppAuth } from "@octokit/auth-app";
// TODO use octokit-plugin-create-pull-request, and fix ts-ignores
// @ts-ignore
import commitMultipleFiles from "octokit-commit-multiple-files";

import type {
  ConfigWithContribution,
  TransformedPR,
  Authorized,
} from "@/types";

import { appId, e2e, installationId, privateKey } from "../env";

import Octokit from "./octokit";

const OctokitPlugin = Octokit.plugin(commitMultipleFiles);

const octokit = new OctokitPlugin({
  authStrategy: createAppAuth,
  auth: {
    appId,
    installationId,
    privateKey,
  },
});

export type CreatePullRequestInputs = {
  authorized: Authorized;
  config: ConfigWithContribution;
  transformed: TransformedPR;
};

export type CreatePullRequestOutputs = {
  url: string;
  number: number;
  title: string;
};

export default async function createPullRequest({
  authorized,
  config: { repo },
  transformed: { files, title, branch, message },
}: CreatePullRequestInputs): Promise<{
  pr: CreatePullRequestOutputs;
  test: any; // for testing
}> {
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

  console.log("comitting", commit);
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
    prOctokit = new Octokit({ auth: githubUser.accessToken });
  }

  console.log("pr", pr);
  const { data } = await prOctokit.rest.pulls.create(pr);

  return {
    pr: {
      url: data.html_url,
      number: data.number,
      title: data.title,
    },
    // in test mode return the submitted commit and data
    test: e2e ? { pr, commit } : undefined,
  };
}
