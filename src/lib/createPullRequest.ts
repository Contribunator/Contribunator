import { createAppAuth } from "@octokit/auth-app";
// TODO use octokit-plugin-create-pull-request, and fix ts-ignores
// @ts-ignore
import commitMultipleFiles from "octokit-commit-multiple-files";

import Octokit from "@/lib/octokit";

import { ConfigWithContribution } from "./config";
import { Authorized } from "./authorize";
import { appId, installationId, privateKey } from "./env";
import { CommonTransformOutputs } from "./commonTransform";

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
  commonTransformed: CommonTransformOutputs;
};

export type CreatePullRequestOutputs = {
  url: string;
  number: number;
  title: string;
};

export default async function createPullRequest({
  authorized,
  config: { repo },
  commonTransformed: { files, title, branch, message },
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

  const { data } = await prOctokit.rest.pulls.create(pr);

  return {
    test: {
      pr,
      commit,
    },
    pr: {
      url: data.html_url,
      number: data.number,
      title: data.title,
    },
  };
}
